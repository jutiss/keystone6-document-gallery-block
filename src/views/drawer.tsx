/** @jsxRuntime classic */
/** @jsx jsx */

import React, { useState, useEffect, useRef, useMemo } from "react";
import { jsx } from "@keystone-ui/core";
import { Drawer, DrawerController, DrawerProvider } from "@keystone-ui/modals";
import { useToasts } from "@keystone-ui/toast";
import {
  ApolloClient,
  useQuery,
  useMutation,
  useApolloClient,
  InMemoryCache,
  gql,
} from "@keystone-6/core/admin-ui/apollo";

import { Button } from "@keystone-ui/button";
import { useList } from "@keystone-6/core/admin-ui/context";
import { LoadingDots } from "@keystone-ui/loading";

import { GalleryItem, GalleryItemPlaceholder, GalleryItemsWrapper } from "./";
import { GalleryItem as GalleryItemType } from "../";

function UploadFile({
  listKey,
  onFinished,
}: {
  listKey: string;
  onFinished?(): void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const list = useList(listKey);
  const toasts = useToasts();

  const UPLOAD_IMAGE = gql`
    mutation ${list.gqlNames.createManyMutationName}($name: String, $file: Upload) {
      ${list.gqlNames.createManyMutationName}(data: { image: { upload: $file }, name: $name }) {
        id
      }
    }
  `;

  const [uploadImage, { loading }] = useMutation(UPLOAD_IMAGE);

  const onUploadChange = async ({
    currentTarget: { validity, files },
  }: React.SyntheticEvent<HTMLInputElement>) => {
    const file = files?.[0]; // bail if the user cancels from the file browser
    if (!file) return;

    for (var i = 0; i < files.length; i++) {
      try {
        await uploadImage({
          variables: { file: files[i], name: files[i].name },
        });
      } catch (err: any) {
        toasts.addToast({
          title: `Failed to upload file: ${files[i].name}`,
          tone: "negative",
          message: err.message,
        });
      }
    }

    onFinished?.();
  };

  return (
    <div>
      <GalleryItemPlaceholder
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        {loading ? (
          <LoadingDots
            css={{
              width: "40px",
              height: "8px",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              margin: "auto",
            }}
            size="small"
            label="Loading"
          />
        ) : (
          <svg
            css={{
              width: "32px",
              height: "32px",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              margin: "auto",
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
        )}
      </GalleryItemPlaceholder>
      <input
        autoComplete="off"
        onChange={onUploadChange}
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        multiple={true}
        accept={"image/*"}
      />
    </div>
  );
}

export default function GalleryDrawer({
  listKey,
  isOpen,
  onCancel,
  onChange,
}: {
  listKey: string;
  isOpen: boolean;
  onCancel(): void;
  onChange(items: GalleryItemType[]): void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const list = useList(listKey);
  const link = useApolloClient().link;
  const toasts = useToasts();

  // we're using a local apollo client here because writing a global implementation of the typePolicies
  // would require making assumptions about how pagination should work which won't always be right
  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        link,
        cache: new InMemoryCache({
          typePolicies: {
            Query: {
              fields: {
                [list.gqlNames.listQueryName]: {
                  keyArgs: ["where"],
                  merge: (
                    existing: readonly unknown[],
                    incoming: readonly unknown[],
                    { args }
                  ) => {
                    const merged = existing ? existing.slice() : [];
                    const { skip } = args!;
                    for (let i = 0; i < incoming.length; ++i) {
                      merged[skip + i] = incoming[i];
                    }
                    return merged;
                  },
                },
              },
            },
          },
        }),
      }),
    [link]
  );

  const GET_IMAGES = gql`
    query ${list.gqlNames.listQueryName}($take: Int, $skip: Int) {
      ${list.gqlNames.listQueryName}(orderBy: [{ id: desc }], take: $take, skip: $skip) {
        id
        image {
          url
          width
          height
        }
      }
      ${list.gqlNames.listQueryCountName}
    }
  `;

  const DELETE_IMAGES = gql`
    mutation ${list.gqlNames.deleteManyMutationName}($where: [${list.gqlNames.whereUniqueInputName}!]!) {
      ${list.gqlNames.deleteManyMutationName}(where: $where) {
        id
      }
    }
  `;

  const { loading, error, data, fetchMore, refetch } = useQuery(GET_IMAGES, {
    variables: {
      skip: 0,
      take: list.pageSize,
    },
    client: apolloClient,
  });

  const [deleteImages, {}] = useMutation(DELETE_IMAGES, {
    refetchQueries: [GET_IMAGES, list.gqlNames.listQueryName],
    client: apolloClient,
  });

  const actions = {
    cancel: {
      action: () => onCancel(),
      label: "Cancel",
    },
    confirm: {
      action: () => {
        const images = data[list.gqlNames.listQueryName].filter(
          (item: GalleryItemType) => selected.includes(item.id)
        );

        onChange(images);
        setSelected([]);
        onCancel();
      },
      label: "Confirm",
    },
  };

  const toggleItem = (item: GalleryItemType) => {
    setSelected(
      selected.includes(item.id)
        ? selected.filter((i) => i != item.id) // remove item
        : [...selected, item.id]
    );
  };

  const deleteItems = async () => {
    const items = selected.map((item) => {
      return {
        id: item,
      };
    });

    try {
      await deleteImages({
        variables: {
          where: items,
        },
      });

      setSelected([]);
    } catch (err: any) {
      toasts.addToast({
        title: "Failed to delete image",
        tone: "negative",
        message: err.message,
      });
    }
  };

  const listItems =
    loading || error
      ? []
      : data[list.gqlNames.listQueryName].map((item: GalleryItemType) => {
          return (
            <GalleryItem
              key={item.id}
              item={item}
              checked={selected.includes(item.id)}
              onClick={() => toggleItem(item)}
            />
          );
        });

  return (
    <DrawerProvider>
      <DrawerController isOpen={isOpen}>
        <Drawer title="Image Gallery" actions={actions}>
          {loading ? (
            <div
              css={{
                minHeight: "calc(100vh - 170px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LoadingDots label="Loading" />
            </div>
          ) : (
            <div
              css={{
                minHeight: "calc(100vh - 170px)",
              }}
            >
              {error ? (
                <div>Error has occurred: {error?.message}</div>
              ) : (
                <div>
                  <div
                    css={{
                      padding: "20px 0 0 0",
                      display: "flex",
                      justifyContent: "space-between",
                      minHeight: "52px",
                    }}
                  >
                    <div>
                      Showing{" "}
                      <strong>
                        {data[list.gqlNames.listQueryName].length}
                      </strong>{" "}
                      of {data[list.gqlNames.listQueryCountName]} image(s)
                    </div>
                    {selected.length > 0 && (
                      <Button
                        tone="negative"
                        size="small"
                        onClick={() => deleteItems()}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                  <GalleryItemsWrapper>
                    <UploadFile
                      listKey={listKey}
                      onFinished={() => refetch()}
                    />
                    {listItems}
                  </GalleryItemsWrapper>
                  {data[list.gqlNames.listQueryCountName] > list.pageSize && (
                    <div>
                      <Button
                        onClick={() =>
                          fetchMore({
                            variables: {
                              skip: data[list.gqlNames.listQueryName].length,
                            },
                          })
                        }
                      >
                        Fetch more
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Drawer>
      </DrawerController>
    </DrawerProvider>
  );
}
