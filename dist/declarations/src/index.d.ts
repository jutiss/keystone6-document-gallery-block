import { FormField } from "@keystone-6/fields-document/component-blocks";
export declare type ImageData = {
    height: number;
    width: number;
    filesize: number;
    extension: string;
    id: string;
    url: string;
};
export declare type GalleryItem = {
    id: string;
    name: string;
    image: ImageData;
};
export declare const gallery: ({ listKey }: {
    listKey: string;
}) => import("@keystone-6/fields-document/component-blocks").ComponentBlock<{
    items: FormField<GalleryItem[], undefined>;
    capture: import("@keystone-6/fields-document/component-blocks").ChildField;
}>;
