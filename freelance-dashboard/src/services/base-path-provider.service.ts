import {BASE_PATH} from '../../generated';

export const basePathProviderFactory = () => {
  return '/api'
}

export const BasePathProviderService = {
  provide: BASE_PATH,
  useFactory: basePathProviderFactory,
  deps: []
}
