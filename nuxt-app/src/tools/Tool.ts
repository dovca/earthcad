import type {SceneContext} from '~/src/types';

export default class Tool {
	constructor(protected context: SceneContext) {
	}

	abstract destroy(): void;
}
