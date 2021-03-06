//显示所有🐱
let button1 = document.querySelector("#displayMiao");
button1.addEventListener("click", displayMiao);

function displayMiao() {
  fetch("http://xieranmaya.github.io/images/cats/cats.json")
    .then(re => re.text())
    .then(text => {
      display(generate(JSON.parse(text)));
    });
  function generate(obj) {
    return obj.map(it => "http://xieranmaya.github.io/images/cats/" + it.url).sort(() => Math.random() - 0.5);
  }
  function display(urls) {
    let div = document.createElement("div");
    urls.forEach(url => {
      let imgContainer = document.createElement("div");
      let img = document.createElement("img");
      imgContainer.className = "img-container";
      img.src = url;
      imgContainer.appendChild(img);
      div.appendChild(imgContainer);
    });
    document.body.appendChild(div);
  }
}

//一个一个显示🐱
let button2 = document.querySelector("#displayMiaoOneByOne");
button2.addEventListener("click", displayMiaoOneByOne);


function displayMiaoOneByOne() {
  let urls;
  fetch("http://xieranmaya.github.io/images/cats/cats.json")
    .then(re => re.text())
    .then(text => {
      urls = JSON.parse(text).map(it => "http://xieranmaya.github.io/images/cats/" + it.url);
      let div = document.createElement("div");
      document.body.appendChild(div);
      addImg(urls, div, 0);
    });
  function addImg(urls, div, index) {
    if (index < urls.length) {
      let imgContainer = document.createElement("div");
      imgContainer.className = "img-container";
      let text = document.createTextNode("loading...");
      imgContainer.appendChild(text);
      div.appendChild(imgContainer);
      let img = document.createElement("img");
      imgContainer.appendChild(img);
      img.style.display = "none";
      img.src = urls[index];
      img.addEventListener("load", () => {
        text.remove();
        img.style.display = "block";
        addImg(urls, div, index + 1);
      });
    }
  }
}

//3个3个出来
let button3 = document.querySelector("#displayMiaoTrible");
button3.addEventListener("click", displayMiaoTrible);

function displayMiaoTrible() {
  let urls;
  fetch("http://xieranmaya.github.io/images/cats/cats.json")
    .then(re => re.text())
    .then(text => {
      urls = JSON.parse(text).map(it => "http://xieranmaya.github.io/images/cats/" + it.url);
      let div = document.createElement("div");
      document.body.appendChild(div);
      let index = 0;
      addImg(urls, div);
      function addImg(urls, div) {
        if (index < urls.length) {
          let imgContainer = document.createElement("div");
          imgContainer.className = "img-container";
          let text = document.createTextNode("loading...");
          imgContainer.appendChild(text);
          div.appendChild(imgContainer);
          let img = document.createElement("img");
          imgContainer.appendChild(img);
          img.style.display = "none";
          img.src = urls[index];
          index++;
          img.addEventListener("load", () => {
            text.remove();
            img.style.display = "block";
            addImg(urls, div);
          });
          if (index < 3) {
            addImg(urls, div);
          }
        }
      }
    });
}