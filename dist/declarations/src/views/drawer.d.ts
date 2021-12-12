/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@keystone-ui/core";
import { GalleryItem as GalleryItemType } from "../";
export default function GalleryDrawer({ listKey, isOpen, onCancel, onChange, }: {
    listKey: string;
    isOpen: boolean;
    onCancel(): void;
    onChange(items: GalleryItemType[]): void;
}): jsx.JSX.Element;
