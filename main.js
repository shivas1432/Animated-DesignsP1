const feImage = document.querySelector("feImage");
fetch("https://essykings.github.io/JavaScript/map.png")
  .then((response) => {
    return response.blob();
  })
  .then((blob) => {
    const objURL = URL.createObjectURL(blob);

    feImage.setAttribute("href", objURL);
  });
