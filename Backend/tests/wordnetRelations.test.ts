import { describe, expect, test } from "vitest";
import { mapPointer } from "../services/wordnetRelations";


describe("WordNet pointer mapping", () => {

  test("maps hypernym pointer", () => {

    expect(
      mapPointer("@")
    )
      .toBe("hypernym");

  });


  test("maps hyponym pointer", () => {

    expect(
      mapPointer("~")
    )
      .toBe("hyponym");

  });


  test("maps meronym pointers", () => {

    expect(
      mapPointer("%p")
    )
      .toBe("meronym");

    expect(
      mapPointer("%m")
    )
      .toBe("meronym");

  });


  test("maps holonym pointers", () => {

    expect(
      mapPointer("#p")
    )
      .toBe("holonym");

    expect(
      mapPointer("#m")
    )
      .toBe("holonym");

  });


  test("maps antonym pointer", () => {

    expect(
      mapPointer("!")
    )
      .toBe("antonym");

  });


  test("ignores unsupported pointers", () => {

    expect(
      mapPointer("?")
    )
      .toBeNull();

  });

});