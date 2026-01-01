export const loadFonts = (fonts: { fontFamily: string; url: string }[]) => {
  const promisesList = fonts.map((font) => {
    return new FontFace(font.fontFamily, `url(${font.url})`)
      .load()
      .catch((err) => err);
  });
  if (promisesList.length === 0) return Promise.resolve(true);
  return new Promise((resolve, reject) => {
    Promise.all(promisesList)
      .then((res) => {
        res.forEach((uniqueFont) => {
          if (uniqueFont && uniqueFont.family) {
            document.fonts.add(uniqueFont);
            resolve(true);
          }
        });
      })
      .catch((err) => reject(err));
  });
};
