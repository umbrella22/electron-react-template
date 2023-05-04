import config from '@config/index';

interface HotPublish {
  url: string;
  configName: string;
}

export const hotPublishConfig: HotPublish = {
  url: config.build.hotPublishUrl,
  configName: config.build.hotPublishConfigName,
};
