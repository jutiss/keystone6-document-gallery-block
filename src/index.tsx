import React from "react";
import {
  NotEditable,
  component,
  fields,
  FormField,
} from "@keystone-6/fields-document/component-blocks";

import { FieldContainer } from "@keystone-ui/fields";
import {
  Gallery,
  GalleryItem,
  GalleryItemsWrapper,
  GalleryItemPlaceholder,
} from "./views";

export type ImageData = {
  height: number;
  width: number;
  filesize: number;
  extension: string;
  id: string;
  url: string;
};

export type GalleryItem = {
  id: string;
  name: string;
  image: ImageData;
};

const customFields = {
  gallery<Option extends { label: string; value: GalleryItem }>({
    listKey,
    defaultValue = [],
  }: {
    listKey: string;
    defaultValue?: Option["value"][];
  }): FormField<Option["value"][], undefined> {
    return {
      kind: "form",
      Input({ value, onChange, autoFocus }) {
        return (
          <FieldContainer>
            <Gallery
              listKey={listKey}
              value={value}
              onChange={(items) => onChange(items)}
            />
          </FieldContainer>
        );
      },
      options: undefined,
      defaultValue,
      validate(value) {
        return typeof value === "object";
      },
    };
  },
};

export const gallery = ({ listKey }: { listKey: string }) => {
  return component({
    component: ({ capture, items }) => {
      return (
        <div>
          <NotEditable>
            {items.value.length > 0 ? (
              <GalleryItemsWrapper>
                {items.value.map((image) => {
                  return <GalleryItem key={image.id} item={image} />;
                })}
              </GalleryItemsWrapper>
            ) : (
              <GalleryItemsWrapper>
                <GalleryItemPlaceholder />
                <GalleryItemPlaceholder />
                <GalleryItemPlaceholder />
              </GalleryItemsWrapper>
            )}
          </NotEditable>
          <div
            style={{
              borderLeft: "3px solid #CBD5E0",
              paddingLeft: 16,
            }}
          >
            <div style={{ fontStyle: "italic", color: "#4A5568" }}>
              {capture}
            </div>
          </div>
        </div>
      );
    },
    label: "Gallery",
    props: {
      items: customFields.gallery({
        listKey,
      }),
      capture: fields.child({
        kind: "block",
        placeholder: "Capture...",
        formatting: { inlineMarks: "inherit", softBreaks: "inherit" },
        links: "inherit",
      }),
    },
    chromeless: false,
  });
};
