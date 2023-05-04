import { join } from 'path';
import { say } from 'cfonts';
import inquirer from 'inquirer';
import { deleteSync } from 'del';
import { build as viteBuild } from 'vite';
import { Platform, build, Arch } from 'electron-builder';
import type { Configuration } from 'electron-builder';
import chalk from 'chalk';
import { rollup, OutputOptions } from 'rollup';
import { Listr } from 'listr2';
import buildConfig from '../build.json';
import rollupOptions from './rollup.config';
import { errorLog, doneLog } from './log';

process.env.NODE_ENV = 'production';

const [, , platform] = process.argv;
const EOL = process.platform === 'win32' ? '\r\n' : '\n';

const mainOpt = rollupOptions(process.env.NODE_ENV, 'main');
const preloadOpt = rollupOptions(process.env.NODE_ENV, 'preload');
const isCI = process.env.CI || false;

const [optional, linuxOptional, winOptional] = [
  ['web', 'win', 'mac', 'linux'],
  ['AppImage', 'snap', 'deb', 'rpm', 'pacman'],
  ['win-any', 'win32', 'win64', 'winp-any', 'winp32', 'winp64'],
];

function platformOptional() {
  switch (process.platform) {
    case 'win32':
      return ['web', ...optional.filter((item) => item.startsWith('win'))];
    case 'linux':
      return ['web', ...optional.filter((item) => !(item === 'mac'))];
    default:
      return [...optional];
  }
}

function defaultPlatform() {
  switch (process.platform) {
    case 'win32':
      return 'win';
    case 'darwin':
      return 'mac';
    default:
      return process.platform;
  }
}

const question = async (): Promise<string> =>
  inquirer
    .prompt({
      type: 'list',
      name: 'platform',
      message: 'Which platform is you want to build?',
      choices: platformOptional(),
      default: defaultPlatform(),
    })
    .then(({ platform }: { platform: string }) => platform);

const linuxQuestion = async (): Promise<string> =>
  inquirer
    .prompt({
      type: 'list',
      name: 'platform',
      message: 'Please select linux package',
      choices: linuxOptional,
      default: 'AppImage',
    })
    .then(({ platform }: { platform: string }) => platform);

const winQuestion = async (): Promise<string> =>
  inquirer
    .prompt({
      type: 'list',
      name: 'platform',
      message: 'Please select win arch',
      choices: winOptional,
      default: 'win-any',
    })
    .then(({ platform }: { platform: string }) => platform);

function clean() {
  deleteSync([
    'dist/electron/main/**',
    'dist/electron/renderer/**',
    'dist/web/**',
    'build/**',
    '!build/icons',
    '!build/lib',
    '!build/lib/electron-build.*',
    '!build/icons/icon.*',
    '!dist/electron/main',
    '!dist/electron/renderer',
    '!dist/web',
  ]);
  doneLog('clear done');
  if (process.env.BUILD_TARGET === 'onlyClean') process.exit();
}

if (process.env.BUILD_TARGET === 'onlyClean') clean();

function web() {
  deleteSync(['dist/web/*', '!.gitkeep']);
  viteBuild({ configFile: join(__dirname, 'vite.config.ts') }).then((res) => {
    doneLog('RendererProcess build success');
    process.exit();
  });
}

function greeting() {
  const cols = process.stdout.columns;
  let text: boolean | string = '';

  if (cols > 85) text = `let's-build`;
  else if (cols > 60) text = `let's-|build`;
  else text = false;

  if (text && !isCI) {
    say(text, {
      colors: ['yellow'],
      font: 'simple3d',
      space: false,
    });
  } else console.log(chalk.yellow.bold(`\n  let's-build`));
  console.log();
}

function unionBuild(archTag: Map<Platform, Map<Arch, Array<string>>>) {
  greeting();
  if (process.env.BUILD_TARGET === 'clean') clean();

  const tasksLister = new Listr(
    [
      {
        title: 'building main process',
        task: async () => {
          try {
            const build = await rollup(mainOpt);
            await build.write(mainOpt.output as OutputOptions);
          } catch (error) {
            console.error(`\n${error}\n`);
            errorLog('failed to build main process');
            process.exit(1);
          }
        },
      },
      {
        title: 'building preload process',
        task: async () => {
          try {
            const build = await rollup(preloadOpt);
            await build.write(preloadOpt.output as OutputOptions);
          } catch (error) {
            console.error(`\n${error}\n`);
            errorLog('failed to build main process');
            process.exit(1);
          }
        },
      },
      {
        title: 'building renderer process',
        task: async () => {
          try {
            await viteBuild({ configFile: join(__dirname, 'vite.config.ts') });
          } catch (error) {
            console.error(`\n${error}\n`);
            errorLog('failed to build renderer process');
            process.exit(1);
          }
        },
        options: { persistentOutput: true },
      },
      {
        title: 'building package',
        task: async (_, tasks) => {
          try {
            await build({
              targets: archTag,
              config: buildConfig as Configuration,
            });
            // eslint-disable-next-line no-param-reassign
            tasks.output = `${`${chalk.bgBlue.white(' OKAY ')} `}All done${EOL}`;
          } catch (error) {
            console.error(`\n${error}\n`);
            errorLog('failed to build electron process');
            process.exit(1);
          }
        },
        options: { persistentOutput: true },
      },
    ],
    {
      exitOnError: false,
    },
  );
  tasksLister.run();
}

async function preBuild(): Promise<void> {
  // eslint-disable-next-line no-underscore-dangle
  let _platform = '';
  if (platform) !platformOptional().includes(platform.trim().toLowerCase()) ? (_platform = await question()) : _platform = platform
  else _platform = await question()

  let archTag: null | Map<Platform, Map<Arch, Array<string>>> = null;

  switch (_platform) {
    case 'web':
      return web();
    case 'win':
      {
        archTag = Platform.WINDOWS.createTarget();
        const winArch = await winQuestion();
        const bv = {
          target: winArch.startsWith('winp') ? 'portable' : 'nsis',
          arch: [] as string[],
        };
        if (winArch.indexOf('any') > -1) bv.arch = ['x64', 'ia32'];
        else if (winArch.indexOf('32') > -1) bv.arch = ['ia32'];
        else if (winArch.indexOf('64') > -1) bv.arch = ['x64'];
        (buildConfig as any).win.target = [bv];
      }
      break;
    case 'mac':
      archTag = Platform.MAC.createTarget();
      break;
    case 'linux':
      archTag = Platform.LINUX.createTarget();
      (buildConfig as any).linux.target = await linuxQuestion();
      break;
    default:
      break;
  }
  if (archTag) unionBuild(archTag);
  return Promise.resolve();
}

preBuild();
