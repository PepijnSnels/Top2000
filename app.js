const puppeteer = require("puppeteer");
const top2000lijst = require("./top2000.json");
const express = require("express");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/getlist", async (req, res) => {
  if (req.query.link) {
    let listarray = await comparelist(req.query.link);
    if (listarray.albumcoverarray) {
      res.send(200, listarray);
    } else {
      res.send(400, `ongeldige link`);
    }
  } else {
    res.send(400, "Geen geldige link ingevoerd");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

async function getlist(lijsturl) {
  try {
    let listUrl = lijsturl;
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto(listUrl, { waitUntil: "networkidle2" });

    let song = await page.evaluate(() => {
      let artist = document.querySelectorAll("p.song--artist");
      let title = document.querySelectorAll("p.song--title");
      let albumcover = document.querySelectorAll("img.song--image");
      if (artist.length === 0 || title.length === 0) {
        return `badlist`;
      }
      let artistlist = [].slice.call(artist);
      let titlelist = [].slice.call(title);
      let albumcoverlist = [].slice.call(albumcover);
      let artists = artistlist.map(function (e) {
        return e.innerText;
      });
      let titles = titlelist.map(function (e) {
        return e.innerText;
      });
      let albumcovers = albumcoverlist.map(function (e) {
        return e.src;
      });

      let result = [];
      for (let i = 0; i < artistlist.length; i++) {
        result.push(titles[i], artists[i]);
      }
      const chunkSize = 2;
      const groups = result
        .map((e, i) => {
          return i % chunkSize === 0 ? result.slice(i, i + chunkSize) : null;
        })
        .filter((e) => {
          return e;
        });

      return {
        groups,
        albumcovers,
      };
    });
    await browser.close();
    return song;
  } catch {
    console.log("Oef... de link is niet juist");
    return;
  }
}

async function comparelist(lijsturl) {
  let artiestarray = [];
  let nummerarray = [];
  let plekarray = [];
  let albumcoverarray = [];
  await getlist(lijsturl).then((x) => {
    try {
      if (x != `badlist`) {
        let nummer;
        let artiest;
        let plek;
        if (x.groups) {
          for (j = 0; j < x.groups.length; j++) {
            for (i = 0; i < top2000lijst.length; i++) {
              if (
                x.groups[j].toString().includes(top2000lijst[i].toString()) ===
                true
              ) {
                plek = i;
              }
            }
            nummer = x.groups[j].toString().split(",")[0];
            artiest = x.groups[j].toString().split(",").pop();
            artiestarray.push(artiest);
            nummerarray.push(nummer);
            if (plek != null) {
              plekarray.push(plek);
            } else {
              plekarray.push("x");
            }
            plek = null;
          }
          albumcoverarray = x.albumcovers;
        }
      } else {
        albumcoverarray = null;
      }
    } catch {
      return;
    }
  });
  return { albumcoverarray, plekarray, artiestarray, nummerarray };
}
