const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Biến Hằng lưu trữ thông tin cấu hình trong localStorage
const PLAYER_STORAGE_KEY = "Music_Player_NTN";
// get element
const background = $(".background img");
const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
// get volume
const volumeControl = $(".volume-control");
const volumeIcon = $(".volume-icon");
const volumeRange = $("#volume");

// get option
const optionMenu = $(".option-menu");
const optionIcon = $(".option-icon");

// mãng chứa index bài hát đã random
let randomArray = [];

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  favorites: [],

  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    //covert chuỗi JSON và lưu nó vào local vs key là PLAYER_STORAGE_KEY
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
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
    const html = this.songs.map((song, index) => {
      const isFavorited = this.favorites.includes(index);
      return `<div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index =${index}>
          <div
            class="thumb"
            style="background-image: url(${song.image})"
          ></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="btn-favorite ${
            isFavorited ? "active" : ""
          }" data-index=${index}>
            <i class="fas fa-heart"></i>
          </div>
          <div class="delete" data-index=${index}>
            <i class="fas fa-trash"></i>
          </div>
        </div>`;
    });
    playlist.innerHTML = html.join("");
  },

  handleEvent: function () {
    const cdWidth = cd.offsetWidth;

    // Xử lý nhấn phím space sẽ play / pause
    document.onkeydown = function (e) {
      // console.log(e);
      e = e || window.Event;
      if (e.key === " " && e.target === document.body) {
        e.preventDefault();
        if (app.isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
      }
    };
    // Click ra ngoài đóng opening box
    document.onclick = function (e) {
      if (!e.target.closest(".option-icon")) {
        optionMenu.style.display = null;
      }
      if (!e.target.closest(".volume-control")) {
        volumeRange.style.display = null;
      }
    };

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
      if (app.isRandom) {
        app.randomSong();
      } else {
        app.nextSong();
      }
      audio.play();
      app.render(); // hiện thị lại ds
    };
    // xử lý khi nhấn prev
    prevBtn.onclick = function () {
      if (app.isRandom) {
        app.randomSong();
      } else {
        app.prevSong();
      }
      audio.play();
      app.render();
    };
    // xử lý bật / tắt random song
    randomBtn.onclick = function () {
      app.isRandom = !app.isRandom;
      app.setConfig("isRandom", app.isRandom);
      randomBtn.classList.toggle("active", app.isRandom);
    };

    // xử lý lặp lại song khi bật
    repeatBtn.onclick = function () {
      app.isRepeat = !app.isRepeat;
      app.setConfig("isRepeat", app.isRepeat);
      repeatBtn.classList.toggle("active", app.isRepeat);
    };
    // khi bài hát kết thúc(ended) tự động next or repeat
    audio.onended = function () {
      if (app.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // lắng nghe sự kiện click vào song
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      const favoriteBtn = e.target.closest(".btn-favorite");
      const deleteBtn = e.target.closest(".delete");
      if (songNode && !favoriteBtn && !deleteBtn) {
        // xử lý click vào bài hát thì play
        app.currentIndex = Number(songNode.dataset.index); // covert sang số
        app.loadCurrentSong();
        app.render();
        audio.play();
      }
      if (favoriteBtn) {
        // xử lý click vào like
        const index = Number(favoriteBtn.dataset.index);
        app.favoriteList(index);
      }
      if (deleteBtn) {
        //  xử lý xóa bài hát
        const index = Number(deleteBtn.dataset.index);
        app.deleteSong(index);
      }
    };

    // Xử lý click vào volume tăng / giảm
    volumeIcon.onclick = function () {
      volume.style.display = !Boolean(volume.style.display) ? "block" : null;
    };
    volumeRange.oninput = function (e) {
      audio.volume = e.target.value / 100;
      app.setConfig("volume", e.target.value);
    };

    // click vào option icon
    optionIcon.onclick = function () {
      optionMenu.style.display = !Boolean(optionMenu.style.display)
        ? "block"
        : null;
    };
  },
  deFindProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }, 300);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    background.src = this.currentSong.image;
    audio.src = this.currentSong.path;

    this.scrollToActiveSong();
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom || false;
    this.isRepeat = this.config.isRepeat || false;
    // load volume
    audio.volume = (this.config.volume || 50) / 100;
    volumeRange.value = this.config.volume || 50;
    // load favorite
    this.favorites = this.config.favorites || [];
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex <= 0) {
      this.currentIndex = this.songs.length - 1;
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
  randomSong: function () {
    // nếu ds song nhỏ hơn 2 thì k random
    if (this.songs.length < 2) return;

    if (randomArray.length == 0) {
      randomArray.push(this.currentIndex);
    } else if (randomArray.length == this.songs.length) {
      // gán mãng lại = 0 và add index song hiện tại vào array
      randomArray.length = 0;
      randomArray.push(this.currentIndex);
    }
    let newIndex;
    // bài hát không bị lặp lại trước khi tất cả bài hát khác được phát.
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (randomArray.includes(newIndex));

    this.currentIndex = newIndex;
    this.loadCurrentSong();

    // thêm index mới vào mãng
    randomArray.push(newIndex);
  },
  favoriteList: function (indexSong) {
    const isFavorited = this.favorites.includes(indexSong);
    if (isFavorited) {
      // xóa bài hát khỏi ds
      // tạo một mảng mới, chỉ chứa các bài hát không có chỉ số là indexSong .
      this.favorites = this.favorites.filter((song) => song !== indexSong);
    } else {
      this.favorites.push(indexSong);
    }

    this.setConfig("favorites", this.favorites);
    this.render();
  },
  deleteSong: function (indexSong) {
    if (confirm("Bạn có chắc muốn xóa bài hát này chứ!")) {
      this.songs.splice(indexSong, 1);
      this.favorites = this.favorites.filter((fav) => fav !== indexSong);
      this.favorites = this.favorites.map((fav) =>
        fav > indexSong ? fav - 1 : fav
      );
      if (this.currentIndex === indexSong) {
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : 0;
        this.loadCurrentSong();
      } else if (this.currentIndex > indexSong) {
        this.currentIndex--;
      }

      this.setConfig("newSongs", this.songs);
      this.setConfig("favorites", this.favorites);
      this.render();
    }
  },
  start: function () {
    // Gán cấu hình vào ứng dựng
    this.loadConfig();
    // định nghĩa các thuộc tính
    this.deFindProperties();
    //  xử lý sự kiện
    this.handleEvent();
    // load bài hát đầu tiên
    this.loadCurrentSong();

    // hiển thị list song
    this.render();

    // hiển thị trạng thái ban đầu cảu repeat vs random
    randomBtn.classList.toggle("active", app.isRandom);
    repeatBtn.classList.toggle("active", app.isRepeat);
  },
};

app.start();
