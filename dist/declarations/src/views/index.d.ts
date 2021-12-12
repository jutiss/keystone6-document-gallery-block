/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@keystone-ui/core";
import { GalleryItem as GalleryItemFields } from "../";
export declare const GalleryItem: ({ onClick, onRemove, item, checked, }: {
    onClick?(value: GalleryItemFields): void;
    onRemove?(value: GalleryItemFields): void;
    item: GalleryItemFields;
    checked?: boolean;
}) => jsx.JSX.Element;
export declare const GalleryItemPlaceholder: ({ children, onClick }: {
    children?: any;
    onClick?(): void;
}) => jsx.JSX.Element;
export declare const GalleryItemsWrapper: ({ children }: {
    children: any;
}) => jsx.JSX.Element;
export declare const Gallery: ({ listKey, value, onChange, }: {
    listKey: string;
    value: GalleryItemFields[];
    onChange(value: GalleryItemFields[]): void;
}) => jsx.JSX.Element;
