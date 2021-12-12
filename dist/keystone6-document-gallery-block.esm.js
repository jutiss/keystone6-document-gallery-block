import React, { useState, useMemo, useRef } from 'react';
import { component, NotEditable, fields } from '@keystone-6/fields-document/component-blocks';
import { Checkbox, FieldContainer } from '@keystone-ui/fields';
import { jsx } from '@keystone-ui/core';
import { Button } from '@keystone-ui/button';
import { DrawerProvider, DrawerController, Drawer } from '@keystone-ui/modals';
import { useToasts } from '@keystone-ui/toast';
import { useApolloClient, ApolloClient, InMemoryCache, gql, useQuery, useMutation } from '@keystone-6/core/admin-ui/apollo';
import { useList } from '@keystone-6/core/admin-ui/context';
import { LoadingDots } from '@keystone-ui/loading';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _objectDestructuringEmpty(obj) {
  if (obj == null) throw new TypeError("Cannot destructure undefined");
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

var _templateObject, _templateObject2, _templateObject3;

function UploadFile(_ref) {
  var listKey = _ref.listKey,
      onFinished = _ref.onFinished;
  var inputRef = useRef(null);
  var list = useList(listKey);
  var toasts = useToasts();
  var UPLOAD_IMAGE = gql(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    mutation ", "($name: String, $file: Upload) {\n      ", "(data: { image: { upload: $file }, name: $name }) {\n        id\n      }\n    }\n  "])), list.gqlNames.createManyMutationName, list.gqlNames.createManyMutationName);

  var _useMutation = useMutation(UPLOAD_IMAGE),
      _useMutation2 = _slicedToArray(_useMutation, 2),
      uploadImage = _useMutation2[0],
      loading = _useMutation2[1].loading;

  var onUploadChange = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2) {
      var _ref2$currentTarget, files, file, i;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _ref2$currentTarget = _ref2.currentTarget, files = _ref2$currentTarget.files;
              file = files === null || files === void 0 ? void 0 : files[0]; // bail if the user cancels from the file browser

              if (file) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return");

            case 4:
              i = 0;

            case 5:
              if (!(i < files.length)) {
                _context.next = 17;
                break;
              }

              _context.prev = 6;
              _context.next = 9;
              return uploadImage({
                variables: {
                  file: files[i],
                  name: files[i].name
                }
              });

            case 9:
              _context.next = 14;
              break;

            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](6);
              toasts.addToast({
                title: "Failed to upload file: ".concat(files[i].name),
                tone: "negative",
                message: _context.t0.message
              });

            case 14:
              i++;
              _context.next = 5;
              break;

            case 17:
              onFinished === null || onFinished === void 0 ? void 0 : onFinished();

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[6, 11]]);
    }));

    return function onUploadChange(_x) {
      return _ref3.apply(this, arguments);
    };
  }();

  return jsx("div", null, jsx(GalleryItemPlaceholder, {
    onClick: function onClick() {
      var _inputRef$current;

      (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : _inputRef$current.click();
    }
  }, loading ? jsx(LoadingDots, {
    css: {
      width: "40px",
      height: "8px",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: "auto"
    },
    size: "small",
    label: "Loading"
  }) : jsx("svg", {
    css: {
      width: "32px",
      height: "32px",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: "auto"
    },
    xmlns: "http://www.w3.org/2000/svg",
    width: "32",
    height: "32",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, jsx("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
  }))), jsx("input", {
    autoComplete: "off",
    onChange: onUploadChange,
    type: "file",
    ref: inputRef,
    style: {
      display: "none"
    },
    multiple: true,
    accept: "image/*"
  }));
}

function GalleryDrawer(_ref4) {
  var listKey = _ref4.listKey,
      isOpen = _ref4.isOpen,
      onCancel = _ref4.onCancel,
      onChange = _ref4.onChange;

  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      selected = _useState2[0],
      setSelected = _useState2[1];

  var list = useList(listKey);
  var link = useApolloClient().link;
  var toasts = useToasts(); // we're using a local apollo client here because writing a global implementation of the typePolicies
  // would require making assumptions about how pagination should work which won't always be right

  var apolloClient = useMemo(function () {
    return new ApolloClient({
      link: link,
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: _defineProperty({}, list.gqlNames.listQueryName, {
              keyArgs: ["where"],
              merge: function merge(existing, incoming, _ref5) {
                var args = _ref5.args;
                var merged = existing ? existing.slice() : [];
                var _ref6 = args,
                    skip = _ref6.skip;

                for (var i = 0; i < incoming.length; ++i) {
                  merged[skip + i] = incoming[i];
                }

                return merged;
              }
            })
          }
        }
      })
    });
  }, [link]);
  var GET_IMAGES = gql(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    query ", "($take: Int, $skip: Int) {\n      ", "(orderBy: [{ id: desc }], take: $take, skip: $skip) {\n        id\n        image {\n          url\n          width\n          height\n        }\n      }\n      ", "\n    }\n  "])), list.gqlNames.listQueryName, list.gqlNames.listQueryName, list.gqlNames.listQueryCountName);
  var DELETE_IMAGES = gql(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    mutation ", "($where: [", "!]!) {\n      ", "(where: $where) {\n        id\n      }\n    }\n  "])), list.gqlNames.deleteManyMutationName, list.gqlNames.whereUniqueInputName, list.gqlNames.deleteManyMutationName);

  var _useQuery = useQuery(GET_IMAGES, {
    variables: {
      skip: 0,
      take: list.pageSize
    },
    client: apolloClient
  }),
      loading = _useQuery.loading,
      error = _useQuery.error,
      data = _useQuery.data,
      fetchMore = _useQuery.fetchMore,
      refetch = _useQuery.refetch;

  var _useMutation3 = useMutation(DELETE_IMAGES, {
    refetchQueries: [GET_IMAGES, list.gqlNames.listQueryName],
    client: apolloClient
  }),
      _useMutation4 = _slicedToArray(_useMutation3, 2),
      deleteImages = _useMutation4[0];

  _objectDestructuringEmpty(_useMutation4[1]);

  var actions = {
    cancel: {
      action: function action() {
        return onCancel();
      },
      label: "Cancel"
    },
    confirm: {
      action: function action() {
        var images = data[list.gqlNames.listQueryName].filter(function (item) {
          return selected.includes(item.id);
        });
        onChange(images);
        setSelected([]);
        onCancel();
      },
      label: "Confirm"
    }
  };

  var toggleItem = function toggleItem(item) {
    setSelected(selected.includes(item.id) ? selected.filter(function (i) {
      return i != item.id;
    }) // remove item
    : [].concat(_toConsumableArray(selected), [item.id]));
  };

  var deleteItems = /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var items;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              items = selected.map(function (item) {
                return {
                  id: item
                };
              });
              _context2.prev = 1;
              _context2.next = 4;
              return deleteImages({
                variables: {
                  where: items
                }
              });

            case 4:
              setSelected([]);
              _context2.next = 10;
              break;

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](1);
              toasts.addToast({
                title: "Failed to delete image",
                tone: "negative",
                message: _context2.t0.message
              });

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[1, 7]]);
    }));

    return function deleteItems() {
      return _ref7.apply(this, arguments);
    };
  }();

  var listItems = loading || error ? [] : data[list.gqlNames.listQueryName].map(function (item) {
    return jsx(GalleryItem, {
      key: item.id,
      item: item,
      checked: selected.includes(item.id),
      onClick: function onClick() {
        return toggleItem(item);
      }
    });
  });
  return jsx(DrawerProvider, null, jsx(DrawerController, {
    isOpen: isOpen
  }, jsx(Drawer, {
    title: "Image Gallery",
    actions: actions
  }, loading ? jsx("div", {
    css: {
      minHeight: "calc(100vh - 170px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }
  }, jsx(LoadingDots, {
    label: "Loading"
  })) : jsx("div", {
    css: {
      minHeight: "calc(100vh - 170px)"
    }
  }, error ? jsx("div", null, "Error has occurred: ", error === null || error === void 0 ? void 0 : error.message) : jsx("div", null, jsx("div", {
    css: {
      padding: "20px 0 0 0",
      display: "flex",
      justifyContent: "space-between",
      minHeight: "52px"
    }
  }, jsx("div", null, "Showing", " ", jsx("strong", null, data[list.gqlNames.listQueryName].length), " ", "of ", data[list.gqlNames.listQueryCountName], " image(s)"), selected.length > 0 && jsx(Button, {
    tone: "negative",
    size: "small",
    onClick: function onClick() {
      return deleteItems();
    }
  }, "Delete")), jsx(GalleryItemsWrapper, null, jsx(UploadFile, {
    listKey: listKey,
    onFinished: function onFinished() {
      return refetch();
    }
  }), listItems), data[list.gqlNames.listQueryCountName] > list.pageSize && jsx("div", null, jsx(Button, {
    onClick: function onClick() {
      return fetchMore({
        variables: {
          skip: data[list.gqlNames.listQueryName].length
        }
      });
    }
  }, "Fetch more")))))));
}

var GalleryItem = function GalleryItem(_ref) {
  var _onClick = _ref.onClick,
      onRemove = _ref.onRemove,
      item = _ref.item,
      _ref$checked = _ref.checked,
      checked = _ref$checked === void 0 ? false : _ref$checked;
  return jsx("div", {
    css: {
      backgroundColor: "#e1e5e9",
      borderRadius: "8px",
      paddingBottom: "56.25%",
      position: "relative",
      overflow: "hidden",
      cursor: "pointer"
    },
    onClick: function onClick() {
      return _onClick === null || _onClick === void 0 ? void 0 : _onClick(item);
    }
  }, _onClick && jsx("div", {
    css: {
      position: "absolute",
      zIndex: "1",
      margin: "10px",
      right: "0"
    }
  }, jsx(Checkbox, {
    checked: checked,
    readOnly: true
  })), onRemove && jsx("div", {
    css: {
      position: "absolute",
      zIndex: "1",
      margin: "10px",
      right: "0"
    }
  }, jsx(Button, {
    size: "small",
    tone: "negative",
    onClick: function onClick() {
      return onRemove(item);
    }
  }, jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, jsx("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M6 18L18 6M6 6l12 12"
  })))), jsx("img", {
    css: {
      objectFit: "cover",
      width: "100%",
      height: "100%",
      position: "absolute"
    },
    src: item.image.url,
    alt: item.id
  }));
};
var GalleryItemPlaceholder = function GalleryItemPlaceholder(_ref2) {
  var children = _ref2.children,
      _onClick2 = _ref2.onClick;
  return jsx("div", {
    onClick: function onClick() {
      return _onClick2 === null || _onClick2 === void 0 ? void 0 : _onClick2();
    },
    css: {
      backgroundColor: "#e1e5e9",
      borderRadius: "8px",
      paddingBottom: "56.25%",
      position: "relative",
      overflow: "hidden",
      cursor: "pointer",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }, children);
};
var GalleryItemsWrapper = function GalleryItemsWrapper(_ref3) {
  var children = _ref3.children;
  return jsx("div", {
    css: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "1rem",
      margin: "30px 0"
    }
  }, children);
};
var Gallery = function Gallery(_ref4) {
  var listKey = _ref4.listKey,
      value = _ref4.value,
      onChange = _ref4.onChange;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isModalOpen = _useState2[0],
      setIsModalOpen = _useState2[1];

  var removeImage = function removeImage(item) {
    onChange(value.filter(function (i) {
      return i.id !== item.id;
    }));
  };

  var addImages = function addImages(items) {
    var valueIds = value.map(function (i) {
      return i.id;
    });
    var newItems = items.filter(function (item) {
      return !valueIds.includes(item.id);
    });
    onChange([].concat(_toConsumableArray(value), _toConsumableArray(newItems)));
  };

  var listItems = value.map(function (item) {
    return jsx(GalleryItem, {
      key: item.id,
      item: item,
      checked: false,
      onRemove: function onRemove(item) {
        return removeImage(item);
      }
    });
  });
  return jsx("div", null, value.length > 0 ? jsx(GalleryItemsWrapper, null, listItems) : jsx(GalleryItemsWrapper, null, jsx(GalleryItemPlaceholder, null), jsx(GalleryItemPlaceholder, null), jsx(GalleryItemPlaceholder, null)), jsx(Button, {
    onClick: function onClick() {
      return setIsModalOpen(true);
    }
  }, jsx("span", null, "Add Images")), jsx(GalleryDrawer, {
    listKey: listKey,
    isOpen: isModalOpen,
    onCancel: function onCancel() {
      return setIsModalOpen(false);
    },
    onChange: function onChange(items) {
      return addImages(items);
    }
  }));
};

var customFields = {
  gallery: function gallery(_ref) {
    var listKey = _ref.listKey,
        _ref$defaultValue = _ref.defaultValue,
        defaultValue = _ref$defaultValue === void 0 ? [] : _ref$defaultValue;
    return {
      kind: "form",
      Input: function Input(_ref2) {
        var value = _ref2.value,
            _onChange = _ref2.onChange;
            _ref2.autoFocus;
        return /*#__PURE__*/React.createElement(FieldContainer, null, /*#__PURE__*/React.createElement(Gallery, {
          listKey: listKey,
          value: value,
          onChange: function onChange(items) {
            return _onChange(items);
          }
        }));
      },
      options: undefined,
      defaultValue: defaultValue,
      validate: function validate(value) {
        return _typeof(value) === "object";
      }
    };
  }
};
var gallery = function gallery(_ref3) {
  var listKey = _ref3.listKey;
  return component({
    component: function component(_ref4) {
      var capture = _ref4.capture,
          items = _ref4.items;
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(NotEditable, null, items.value.length > 0 ? /*#__PURE__*/React.createElement(GalleryItemsWrapper, null, items.value.map(function (image) {
        return /*#__PURE__*/React.createElement(GalleryItem, {
          key: image.id,
          item: image
        });
      })) : /*#__PURE__*/React.createElement(GalleryItemsWrapper, null, /*#__PURE__*/React.createElement(GalleryItemPlaceholder, null), /*#__PURE__*/React.createElement(GalleryItemPlaceholder, null), /*#__PURE__*/React.createElement(GalleryItemPlaceholder, null))), /*#__PURE__*/React.createElement("div", {
        style: {
          borderLeft: "3px solid #CBD5E0",
          paddingLeft: 16
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontStyle: "italic",
          color: "#4A5568"
        }
      }, capture)));
    },
    label: "Gallery",
    props: {
      items: customFields.gallery({
        listKey: listKey
      }),
      capture: fields.child({
        kind: "block",
        placeholder: "Capture...",
        formatting: {
          inlineMarks: "inherit",
          softBreaks: "inherit"
        },
        links: "inherit"
      })
    },
    chromeless: false
  });
};

export { gallery };
