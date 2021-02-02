import { decode } from "../lib";

test("smoke", function () {
  expect(decode).toMatchInlineSnapshot(`[Function]`);
});

test("no arguments", function () {
  expect(decode).toThrowErrorMatchingInlineSnapshot(
    `"Cannot destructure property 'children' of 'undefined' as it is undefined."`
  );
});

test("empty object", function () {
  function func() {
    decode({});
  }

  expect(func).toThrowErrorMatchingInlineSnapshot(`"Unknown node 'undefined'"`);
});

describe("methodCall", function () {
  test("no children", function () {
    function func() {
      decode({ nodeName: "methodCall" });
    }

    expect(func).toThrowErrorMatchingInlineSnapshot(
      `"children is not iterable"`
    );
  });

  test("empty children", function () {
    const result = decode({ children: [], nodeName: "methodCall" });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "method": undefined,
        "params": undefined,
      }
    `);
  });

  test("children", function () {
    const result = decode({
      children: [
        { nodeName: "methodName", textContent: "foo" },
        {
          nodeName: "params",
          children: [
            {
              firstElementChild: {
                firstElementChild: {
                  firstElementChild: {
                    firstElementChild: {
                      children: [
                        {
                          firstElementChild: {
                            nodeName: "base64",
                            textContent: "",
                          },
                        },
                        {
                          firstElementChild: {
                            nodeName: "boolean",
                            textContent: "true",
                          },
                        },
                      ],
                    },
                  },
                  nodeName: "array",
                },
              },
            },
            {
              firstElementChild: {
                firstElementChild: {
                  nodeName: "struct",
                  children: [
                    {
                      children: [
                        {
                          nodeName: "name",
                          textContent: "date",
                        },
                        {
                          firstElementChild: {
                            nodeName: "dateTime.iso8601",
                            textContent: "1970-01-01T00:00:00.000Z",
                          },
                          nodeName: "value",
                        },
                      ],
                    },
                    {
                      children: [
                        {
                          nodeName: "name",
                          textContent: "number",
                        },
                        {
                          firstElementChild: {
                            nodeName: "double",
                            textContent: "3.1415926",
                          },
                          nodeName: "value",
                        },
                      ],
                    },
                    {
                      children: [
                        {
                          nodeName: "name",
                          textContent: "integer",
                        },
                        {
                          firstElementChild: {
                            nodeName: "int",
                            textContent: "4",
                          },
                          nodeName: "value",
                        },
                      ],
                    },
                    {
                      children: [
                        {
                          nodeName: "name",
                          textContent: "chain",
                        },
                        {
                          firstElementChild: {
                            nodeName: "string",
                            textContent: "cadena",
                          },
                          nodeName: "value",
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
      nodeName: "methodCall",
    });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "method": "foo",
        "params": Array [
          Array [
            "",
            true,
          ],
          Object {
            "chain": "cadena",
            "date": 1970-01-01T00:00:00.000Z,
            "integer": 4,
            "number": 3.1415926,
          },
        ],
      }
    `);
  });

  describe("duplicates", function () {
    test("methodName", function () {
      function func() {
        decode({
          children: [
            { nodeName: "methodName", textContent: "foo" },
            { nodeName: "methodName", textContent: "foo" },
          ],
          nodeName: "methodCall",
        });
      }

      expect(func).toThrowErrorMatchingInlineSnapshot(
        `"Duplicated node 'methodName'"`
      );
    });

    test("params", function () {
      function func() {
        decode({
          children: [
            { nodeName: "params", children: [] },
            { nodeName: "params", children: [] },
          ],
          nodeName: "methodCall",
        });
      }

      expect(func).toThrowErrorMatchingInlineSnapshot(
        `"Duplicated node 'params'"`
      );
    });
  });

  test("unknown node", function () {
    function func() {
      decode({
        children: [{ nodeName: "foo" }],
        nodeName: "methodCall",
      });
    }

    expect(func).toThrowErrorMatchingInlineSnapshot(`"Unknown node 'foo'"`);
  });
});

describe("methodResponse", function () {
  test("empty children (undefined response)", function () {
    const result = decode({ children: [], nodeName: "methodResponse" });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "error": undefined,
        "result": undefined,
      }
    `);
  });

  test("fault", function () {
    const result = decode({
      children: [
        {
          firstElementChild: {
            firstElementChild: {
              nodeName: "string",
              textContent: "ouch",
            },
          },
          nodeName: "fault",
        },
      ],
      nodeName: "methodResponse",
    });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "error": "ouch",
        "result": undefined,
      }
    `);
  });

  test("params", function () {
    const result = decode({
      children: [
        {
          children: [],
          nodeName: "params",
        },
      ],
      nodeName: "methodResponse",
    });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "error": undefined,
        "result": undefined,
      }
    `);
  });

  test("multiple childs (ex. both fault and params)", function () {
    function func() {
      decode({
        children: [
          {
            children: [],
            nodeName: "fault",
          },
          {
            children: [],
            nodeName: "params",
          },
        ],
        nodeName: "methodResponse",
      });
    }

    expect(func).toThrowErrorMatchingInlineSnapshot(
      `"Invalid methodResponse"`
    );
  });

  test("unknown node", function () {
    function func() {
      decode({
        children: [
          {
            nodeName: "foo",
          },
        ],
        nodeName: "methodResponse",
      });
    }

    expect(func).toThrowErrorMatchingInlineSnapshot(`"Unknown node 'foo'"`);
  });
});

describe("Syntax errors", function () {
  describe("parseMember", function () {
    describe("duplicates", function () {
      test("name", function () {
        function func() {
          decode({
            children: [
              {
                children: [
                  {
                    firstElementChild: {
                      firstElementChild: {
                        children: [
                          {
                            children: [
                              { nodeName: "name", textContent: "foo" },
                              { nodeName: "name" },
                            ],
                          },
                        ],
                        nodeName: "struct",
                      },
                    },
                  },
                ],
                nodeName: "params",
              },
            ],
            nodeName: "methodResponse",
          });
        }

        expect(func).toThrowErrorMatchingInlineSnapshot(
          `"Duplicated node 'name'"`
        );
      });

      test("value", function () {
        function func() {
          decode({
            children: [
              {
                children: [
                  {
                    firstElementChild: {
                      firstElementChild: {
                        children: [
                          {
                            children: [
                              {
                                firstElementChild: {
                                  nodeName: "i4",
                                  textContent: "1234",
                                },
                                nodeName: "value",
                              },
                              { nodeName: "value" },
                            ],
                          },
                        ],
                        nodeName: "struct",
                      },
                    },
                  },
                ],
                nodeName: "params",
              },
            ],
            nodeName: "methodResponse",
          });
        }

        expect(func).toThrowErrorMatchingInlineSnapshot(
          `"Duplicated node 'value'"`
        );
      });
    });

    test("unknown nodeName", function () {
      function func() {
        decode({
          children: [
            {
              children: [
                {
                  firstElementChild: {
                    firstElementChild: {
                      children: [
                        {
                          children: [
                            {
                              nodeName: "foo",
                            },
                          ],
                        },
                      ],
                      nodeName: "struct",
                    },
                  },
                },
              ],
              nodeName: "params",
            },
          ],
          nodeName: "methodResponse",
        });
      }

      expect(func).toThrowErrorMatchingInlineSnapshot(`"Unknown node 'foo'"`);
    });
  });

  test("unknown value nodeName", function () {
    function func() {
      decode({
        children: [
          {
            children: [
              {
                firstElementChild: {
                  firstElementChild: {
                    nodeName: "foo",
                  },
                },
              },
            ],
            nodeName: "params",
          },
        ],
        nodeName: "methodResponse",
      });
    }

    expect(func).toThrowErrorMatchingInlineSnapshot(`"Unknown node 'foo'"`);
  });
});
