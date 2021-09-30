export enum ObjectType {
  Image = 2,
  Text = 4,
  Line = 5,
  Polygon = 6,
  Polyline = 7,
  TextOnPath = 8,
}

export class Document {
  constructor(private content: any) {}

  get root() {
    return this.content["SCRIBUSUTF8NEW"][0]["DOCUMENT"][0] as {
      CheckProfile: any[];
      COLOR: any[];
      HYPHEN: string;
      CHARSTYLE: any[];
      STYLE: any[];
      TableStyle: any[];
      CellStyle: any[];
      LAYERS: string;
      Printer: string;
      PDF: any[];
      DocItemAttributes: string;
      TablesOfContents: string;
      NotesStyles: any[];
      PageSets: any[];
      Sections: any[];
      MASTERPAGE: any[];
      PAGE: any[];
      PAGEOBJECT: [any];
    };
  }

  get pages() {
    return this.root.PAGE.map((page) => ({
      x: Document.parseSize(page.PAGEXPOS),
      y: Document.parseSize(page.PAGEYPOS),
      width: Document.parseSize(page.PAGEWIDTH),
      height: Document.parseSize(page.PAGEHEIGHT),
      index: parseInt(page.NUM),
    }));
  }

  get objects() {
    return this.root.PAGEOBJECT.map((obj) => {
      const text =
        obj.StoryText == null
          ? undefined
          : (() => {
              const textSelections = (obj.StoryText as any[]).flatMap(
                (storyText) =>
                  (storyText.ITEXT as any[]).flatMap((text) => ({
                    text: text.CH as string,
                    fontFamily: text.FONT as string | undefined,
                    fontSize: text.FONTSIZE as string | undefined,
                  }))
              );
              return textSelections;
            })();

      const pageIndex = parseInt(obj.OwnPage);
      const page = this.pages[pageIndex];

      return {
        x: Document.parseSize(obj.XPOS) - page.x,
        y: Document.parseSize(obj.YPOS) - page.y,
        width: Document.parseSize(obj.WIDTH),
        height: Document.parseSize(obj.HEIGHT),
        page: pageIndex,
        type: parseInt(obj.PTYPE) as ObjectType,
        src: obj.PFILE as string | undefined,
        text,
      };
    });
  }

  static parseSize(input: string) {
    return Math.round((parseFloat(input) / (72.0 / 25.4)) * 10000) / 10000;
  }
}
