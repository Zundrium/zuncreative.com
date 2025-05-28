export enum showcaseItemTag {
	AI,
	AR,
	ThreeD,
	Web,
}

interface showcaseItem {
	title: string;
	description?: string;
	image: "";
	tags: showcaseItemTag[];
}
