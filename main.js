const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// get element
const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");

const app = {
  currentIndex: 0,
  isPlaying: false,
  songs: [
    {
      name: "Đừng làm trái tim anh đau",
      singer: "Huy Vac (cover)",
      path: "./assets/music/DungLamTraiTimAnhDau(Cover)-HuyVac.mp3",
      image: "./assets/img/1.jpg",
    },
    {
      name: "Cẩm Tú Cầu",
      singer: "RaYo x Huynh Văn",
      path: "./assets/music/CamTuCauLofi-RayoHuynhVan.mp3",
      image: "./assets/img/2.jpg",
    },
    {
      name: "Anh Thôi Nhân Nhượng",
      singer: "AnClock",
      path: "./assets/music/AnhThoiNhanNhuong-AnClock.mp3",
      image: "./assets/img/3.jpg",
    },
    {
      name: "Bồ Công Anh",
      singer: "Phong Max",
      path: "./assets/music/BoCongAnhRemix-PhongMax.mp3",
      image: "./assets/img/4.jpg",
    },
    {
      name: "Dù Cho Tận Thế",
      singer: "Erik",
      path: "./assets/music/DuChoTanThe-Erik.mp3",
      image: "./assets/img/5.jpg",
    },
    {
      name: "Nỗi Nhớ Vô Hạn",
      singer: "Thanh Hưng",
      path: "./assets/music/NoiNhoVoHan-ThanhHung-.mp3",
      image: "./assets/img/6.jpg",
    },
  ],
  //   hiển thị all list song
  render: function () {
    const html = this.songs.map((song) => {
      return `<div class="song">
          <div
            class="thumb"
            style="background-image: url(${song.image})"
          ></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="btn-favorite">
            <i class="fas fa-heart"></i>
          </div>
          <div class="delete">
            <i class="fas fa-trash"></i>
          </div>
        </div>`;
    });
    $(".playlist").innerHTML = html.join("");
  },

  handleEvent: function () {
    const cdWidth = cd.offsetWidth;

    // Xử lý quay đĩa nhạc (cdThumb)
    const cdThumAnimate = cdThumb.animate(
      { transform: "rotate(360deg)" },
      {
        duration: 10000,
        iterations: Infinity, // lặp vô hạn
      }
    );
    // mặc định k quay
    cdThumAnimate.pause();

    // Phóng to / thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newWidth = cdWidth - scrollTop;

      cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
      //   opacity
      cd.style.opacity = newWidth / cdWidth;
    };

    // xử lý play / pause
    playBtn.onclick = function () {
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    // khi song đc play
    audio.onplay = function () {
      app.isPlaying = true;
      player.classList.add("playing");
      cdThumAnimate.play();
    };
    // khi song bi pause
    audio.onpause = function () {
      app.isPlaying = false;
      player.classList.remove("playing");
      cdThumAnimate.pause();
    };

    // bắt tiến độ khi thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        ); // kết quả % = tg hiện tại / tổng tg của song * 100
        progress.value = progressPercent;
      }
    };
    // xử lý khi tua bài hát
    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // xử lý khi nhấn next
    nextBtn.onclick = function () {
      app.nextSong();
      audio.play();
    };
    // xử lý khi nhấn prev
    prevBtn.onclick = function () {
      app.prevSong();
      audio.play();
    };
  },
  deFindProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex <= 0) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  start: function () {
    // định nghĩa các thuộc tính
    this.deFindProperties();
    //  xử lý sự kiện
    this.handleEvent();
    // load bài hát đầu tiên
    this.loadCurrentSong();

    // hiển thị list song
    this.render();
  },
};

app.start();
