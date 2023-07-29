import {decode} from "xmlrpc-serialization";

const ELEMENT_NODE = 1;

test("smoke", function () {
  expect(decode).toMatchInlineSnapshot(`[Function]`);
});

test("no arguments", function () {
  expect(decode).toThrowErrorMatchingInlineSnapshot(
    `"Cannot destructure property 'childNodes' of 'undefined' as it is undefined."`
  );
});

test("empty object", function () {
  function func() {
    decode({});
  }

  expect(func).toThrowErrorMatchingInlineSnapshot(`"Unknown node 'undefined'"`);
});

describe("methodCall", function () {
  test("no childNodes", function () {
    function func() {
      decode({ nodeName: "methodCall" });
    }

    expect(func).toThrowErrorMatchingInlineSnapshot(
      `"undefined is not iterable (cannot read property Symbol(Symbol.iterator))"`
    );
  });

  test("empty childNodes", function () {
    const result = decode({ childNodes: [], nodeName: "methodCall" });

    expect(result).toMatchInlineSnapshot(`
      {
        "method": undefined,
        "params": undefined,
      }
    `);
  });

  test("childNodes", function () {
    const result = decode({
      childNodes: [
        {
          nodeName: "methodName",
          nodeType: ELEMENT_NODE,
          textContent: "foo",
        },
        {
          nodeName: "params",
          nodeType: ELEMENT_NODE,
          childNodes: [
            {
              nodeType: ELEMENT_NODE,
              firstChild: {
                firstChild: {
                  firstChild: {
                    firstChild: {
                      childNodes: [
                        {
                          nodeType: ELEMENT_NODE,
                          firstChild: {
                            nodeName: "base64",
                            textContent: "",
                          },
                        },
                        {
                          nodeType: ELEMENT_NODE,
                          firstChild: {
                            nodeName: "boolean",
                            textContent: "true",
                          },
                        },
                      ],
                    },
                  },
                  nodeName: "array",
                  nodeType: ELEMENT_NODE,
                },
              },
            },
            {
              nodeType: ELEMENT_NODE,
              firstChild: {
                nodeType: ELEMENT_NODE,
                firstChild: {
                  nodeName: "struct",
                  nodeType: ELEMENT_NODE,
                  childNodes: [
                    {
                      nodeType: ELEMENT_NODE,
                      childNodes: [
                        {
                          nodeName: "name",
                          nodeType: ELEMENT_NODE,
                          textContent: "date",
                        },
                        {
                          firstChild: {
                            nodeName: "dateTime.iso8601",
                            nodeType: ELEMENT_NODE,
                            textContent: "1970-01-01T00:00:00.000Z",
                          },
                          nodeName: "value",
                          nodeType: ELEMENT_NODE,
                        },
                      ],
                    },
                    {
                      nodeType: ELEMENT_NODE,
                      childNodes: [
                        {
                          nodeName: "name",
                          nodeType: ELEMENT_NODE,
                          textContent: "number",
                        },
                        {
                          firstChild: {
                            nodeName: "double",
                            textContent: "3.1415926",
                          },
                          nodeName: "value",
                          nodeType: ELEMENT_NODE,
                        },
                      ],
                    },
                    {
                      nodeType: ELEMENT_NODE,
                      childNodes: [
                        {
                          nodeName: "name",
                          nodeType: ELEMENT_NODE,
                          textContent: "integer",
                        },
                        {
                          firstChild: {
                            nodeName: "int",
                            textContent: "4",
                          },
                          nodeName: "value",
                          nodeType: ELEMENT_NODE,
                        },
                      ],
                    },
                    {
                      nodeType: ELEMENT_NODE,
                      childNodes: [
                        {
                          nodeName: "name",
                          nodeType: ELEMENT_NODE,
                          textContent: "chain",
                        },
                        {
                          firstChild: {
                            nodeName: "string",
                            textContent: "cadena",
                          },
                          nodeName: "value",
                          nodeType: ELEMENT_NODE,
                        },
                        {},
                      ],
                    },
                  ],
                },
              },
            },
          ],
        },
        {},
      ],
      nodeName: "methodCall",
      nodeType: ELEMENT_NODE,
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "method": "foo",
        "params": [
          [
            "",
            true,
          ],
          {
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
          childNodes: [
            {
              nodeName: "methodName",
              nodeType: ELEMENT_NODE,
              textContent: "foo",
            },
            {
              nodeName: "methodName",
              nodeType: ELEMENT_NODE,
              textContent: "foo",
            },
          ],
          nodeName: "methodCall",
          nodeType: ELEMENT_NODE,
        });
      }

      expect(func).toThrowErrorMatchingInlineSnapshot(
        `"Duplicated node 'methodName'"`
      );
    });

    test("params", function () {
      function func() {
        decode({
          childNodes: [
            {
              nodeName: "params",
              nodeType: ELEMENT_NODE,
              childNodes: [],
            },
            {
              nodeName: "params",
              nodeType: ELEMENT_NODE,
              childNodes: [],
            },
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
        childNodes: [
          {
            nodeName: "foo",
            nodeType: ELEMENT_NODE,
          },
        ],
        nodeName: "methodCall",
      });
    }

    expect(func).toThrowErrorMatchingInlineSnapshot(`"Unknown node 'foo'"`);
  });
});

describe("methodResponse", function () {
  test("empty childNodes (undefined response)", function () {
    const result = decode({
      childNodes: [],
      nodeName: "methodResponse",
      nodeType: ELEMENT_NODE,
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "error": undefined,
        "result": undefined,
      }
    `);
  });

  test("fault", function () {
    const result = decode({
      childNodes: [
        {
          firstChild: {
            firstChild: {
              nodeName: "string",
              nodeType: ELEMENT_NODE,
              textContent: "ouch",
            },
          },
          nodeName: "fault",
          nodeType: ELEMENT_NODE,
        },
      ],
      nodeName: "methodResponse",
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "error": "ouch",
        "result": undefined,
      }
    `);
  });

  test("params", function () {
    const result = decode({
      childNodes: [
        {
          childNodes: [],
          nodeName: "params",
          nodeType: ELEMENT_NODE,
        },
      ],
      nodeName: "methodResponse",
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "error": undefined,
        "result": undefined,
      }
    `);
  });

  test("multiple childs (ex. both fault and params)", function () {
    function func() {
      decode({
        childNodes: [
          {
            childNodes: [],
            nodeName: "fault",
            nodeType: ELEMENT_NODE,
          },
          {
            childNodes: [],
            nodeName: "params",
            nodeType: ELEMENT_NODE,
          },
        ],
        nodeName: "methodResponse",
        nodeType: ELEMENT_NODE,
      });
    }

    expect(func).toThrowErrorMatchingInlineSnapshot(`"Invalid methodResponse"`);
  });

  test("unknown node", function () {
    function func() {
      decode({
        childNodes: [
          {
            nodeName: "foo",
            nodeType: ELEMENT_NODE,
          },
        ],
        nodeName: "methodResponse",
        nodeType: ELEMENT_NODE,
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
            childNodes: [
              {
                childNodes: [
                  {
                    firstChild: {
                      firstChild: {
                        childNodes: [
                          {
                            childNodes: [
                              {
                                nodeName: "name",
                                nodeType: ELEMENT_NODE,
                                textContent: "foo",
                              },
                              {
                                nodeName: "name",
                                nodeType: ELEMENT_NODE,
                              },
                            ],
                            nodeType: ELEMENT_NODE,
                          },
                        ],
                        nodeName: "struct",
                        nodeType: ELEMENT_NODE,
                      },
                    },
                    nodeType: ELEMENT_NODE,
                  },
                ],
                nodeName: "params",
                nodeType: ELEMENT_NODE,
              },
            ],
            nodeName: "methodResponse",
            nodeType: ELEMENT_NODE,
          });
        }

        expect(func).toThrowErrorMatchingInlineSnapshot(
          `"Duplicated node 'name'"`
        );
      });

      test("value", function () {
        function func() {
          decode({
            childNodes: [
              {
                childNodes: [
                  {
                    firstChild: {
                      firstChild: {
                        childNodes: [
                          {
                            childNodes: [
                              {
                                firstChild: {
                                  nodeName: "i4",
                                  textContent: "1234",
                                },
                                nodeName: "value",
                                nodeType: ELEMENT_NODE,
                              },
                              {
                                nodeName: "value",
                                nodeType: ELEMENT_NODE,
                              },
                            ],
                            nodeType: ELEMENT_NODE,
                          },
                        ],
                        nodeName: "struct",
                        nodeType: ELEMENT_NODE,
                      },
                      nodeType: ELEMENT_NODE,
                    },
                    nodeType: ELEMENT_NODE,
                  },
                ],
                nodeName: "params",
                nodeType: ELEMENT_NODE,
              },
            ],
            nodeName: "methodResponse",
            nodeType: ELEMENT_NODE,
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
          childNodes: [
            {
              childNodes: [
                {
                  firstChild: {
                    firstChild: {
                      childNodes: [
                        {
                          childNodes: [
                            {
                              nodeName: "foo",
                              nodeType: ELEMENT_NODE,
                            },
                          ],
                          nodeType: ELEMENT_NODE,
                        },
                      ],
                      nodeName: "struct",
                      nodeType: ELEMENT_NODE,
                    },
                    nodeType: ELEMENT_NODE,
                  },
                  nodeType: ELEMENT_NODE,
                },
              ],
              nodeName: "params",
              nodeType: ELEMENT_NODE,
            },
          ],
          nodeName: "methodResponse",
          nodeType: ELEMENT_NODE,
        });
      }

      expect(func).toThrowErrorMatchingInlineSnapshot(`"Unknown node 'foo'"`);
    });
  });

  test("unknown value nodeName", function () {
    function func() {
      decode({
        childNodes: [
          {
            childNodes: [
              {
                firstChild: {
                  firstChild: {
                    nodeName: "foo",
                    nodeType: ELEMENT_NODE,
                  },
                },
                nodeType: ELEMENT_NODE,
              },
            ],
            nodeName: "params",
            nodeType: ELEMENT_NODE,
          },
        ],
        nodeName: "methodResponse",
        nodeType: ELEMENT_NODE,
      });
    }

    expect(func).toThrowErrorMatchingInlineSnapshot(`"Unknown node 'foo'"`);
  });
});
