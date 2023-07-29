import {stringify} from "xmlrpc-serialization";


test("smoke", function () {
  expect(stringify).toMatchInlineSnapshot(`[Function]`);
});

test("no arguments", function () {
  expect(stringify).toThrowErrorMatchingInlineSnapshot(
    `"Cannot destructure property 'error' of 'undefined' as it is undefined."`
  );
});

test("empty object", function () {
  const result = stringify({});

  expect(result).toMatchInlineSnapshot(
    `"<?xml version="1.0"?><methodResponse></methodResponse>"`
  );
});

test("error", function () {
  const result = stringify({ error: new Error() });

  expect(result).toMatchInlineSnapshot(
    `"<?xml version="1.0"?><methodResponse><fault><value><struct><member><name>faultCode</name></member><member><name>faultString</name><value><string></string></value></member></struct></value></fault></methodResponse>"`
  );
});

describe("method", function () {
  test("no params", function () {
    const result = stringify({ method: "foo" });

    expect(result).toMatchInlineSnapshot(
      `"<?xml version="1.0"?><methodCall><methodName>foo</methodName></methodCall>"`
    );
  });

  test("empty params", function () {
    const result = stringify({ method: "foo", params: [] });

    expect(result).toMatchInlineSnapshot(
      `"<?xml version="1.0"?><methodCall><methodName>foo</methodName></methodCall>"`
    );
  });

  test("params", function () {
    const result = stringify({ method: "foo", params: ["bar"] });

    expect(result).toMatchInlineSnapshot(
      `"<?xml version="1.0"?><methodCall><methodName>foo</methodName><params><param><value><string>bar</string></value></param></params></methodCall>"`
    );
  });
});

test("result", function () {
  const result = stringify({
    result: [false, true, 3.4, 5, new Date(0), new ArrayBuffer()],
  });

  expect(result).toMatchInlineSnapshot(
    `"<?xml version="1.0"?><methodResponse><params><param><value><array><data><value><boolean>0</boolean></value>,<value><boolean>1</boolean></value>,<value><double>3.4</double></value>,<value><i4>5</i4></value>,<value><dateTime.iso8601>1970-01-01T00:00:00.000Z</dateTime.iso8601></value>,<value><base64></base64></value></data></array></value></param></params></methodResponse>"`
  );
});
