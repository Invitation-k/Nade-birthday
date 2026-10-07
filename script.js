/* ==========================================================
   BIRTHDAY INVITATION — SCRIPT
   ========================================================== */

const FORM_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwl_zQk4rTvPUUwfLupm5M4zQlRWbapokbM2e88C4xLovAHKZLKz4HLHB_vUdmbJ1NfFQ/exec";


(() => {
  "use strict";

  document.documentElement.classList.add("js");

  const $ = (sel, ctx = document) =>
    ctx.querySelector(sel);

  const $$ = (sel, ctx = document) =>
    Array.from(ctx.querySelectorAll(sel));

  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  /* ==========================================================
     BIRTHDAY NAME
     ========================================================== */

  const nameSource = $("#birthday-name");

  const birthdayName =
    nameSource
      ? nameSource.textContent.trim()
      : "";

  $$(".js-name").forEach((el) => {
    el.textContent = birthdayName;
  });


  /* ==========================================================
     CONFETTI & PETALS
     ========================================================== */

  const canvas = $("#fx");

  let ctx = null;
  let W = 0;
  let H = 0;
  let particles = [];
  let raf = null;


  if (canvas) {

    ctx = canvas.getContext("2d");


    function resizeCanvas() {

      const dpr =
        Math.min(
          window.devicePixelRatio || 1,
          2
        );

      W = window.innerWidth;
      H = window.innerHeight;

      canvas.width = W * dpr;
      canvas.height = H * dpr;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );
    }


    resizeCanvas();

    window.addEventListener(
      "resize",
      resizeCanvas
    );
  }


  const COLORS = [
    "#F7C9D4",
    "#E8B4C0",
    "#DCD3F0",
    "#C9BDEB",
    "#D6E9E0",
    "#FBE6D8",
    "#E8D6BF",
    "#C4A07A"
  ];


  function burst(x, y, opts = {}) {

    if (
      reduceMotion ||
      !canvas ||
      !ctx
    ) {
      return;
    }


    const {
      count = 70,
      angle = -Math.PI / 2,
      spread = Math.PI * 2,
      power = 9,
      kinds = [
        "rect",
        "circle",
        "heart",
        "petal"
      ],
    } = opts;


    for (let i = 0; i < count; i++) {

      const a =
        angle +
        (Math.random() - 0.5) *
        spread;

      const v =
        power *
        (0.4 + Math.random() * 0.8);


      particles.push({
        x,
        y,

        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,

        gravity:
          0.14 +
          Math.random() * 0.08,

        drag: 0.984,

        size:
          6 +
          Math.random() * 8,

        rot:
          Math.random() *
          Math.PI *
          2,

        vr:
          (Math.random() - 0.5) *
          0.22,

        wob:
          Math.random() *
          Math.PI *
          2,

        color:
          COLORS[
            (Math.random() *
              COLORS.length) | 0
          ],

        kind:
          kinds[
            (Math.random() *
              kinds.length) | 0
          ],

        life: 0,

        max:
          150 +
          Math.random() * 90,
      });
    }


    if (!raf) {
      raf =
        requestAnimationFrame(tick);
    }
  }


  function drawParticle(p, alpha) {

    if (!ctx) return;

    ctx.save();

    ctx.translate(
      p.x,
      p.y
    );

    ctx.rotate(p.rot);

    ctx.globalAlpha = alpha;

    ctx.fillStyle = p.color;

    const s = p.size;


    if (p.kind === "rect") {

      ctx.fillRect(
        -s / 2,
        -s / 4,
        s,
        s / 2
      );

    } else if (
      p.kind === "circle"
    ) {

      ctx.beginPath();

      ctx.arc(
        0,
        0,
        s / 3,
        0,
        Math.PI * 2
      );

      ctx.fill();

    } else if (
      p.kind === "petal"
    ) {

      ctx.beginPath();

      ctx.ellipse(
        0,
        0,
        s / 2,
        s / 4,
        0,
        0,
        Math.PI * 2
      );

      ctx.fill();

    } else {

      const h = s / 2;

      ctx.beginPath();

      ctx.moveTo(
        0,
        h * 0.8
      );

      ctx.bezierCurveTo(
        -h * 1.6,
        -h * 0.2,
        -h * 0.6,
        -h * 1.4,
        0,
        -h * 0.5
      );

      ctx.bezierCurveTo(
        h * 0.6,
        -h * 1.4,
        h * 1.6,
        -h * 0.2,
        0,
        h * 0.8
      );

      ctx.fill();
    }


    ctx.restore();
  }


  function tick() {

    if (!ctx) return;

    ctx.clearRect(
      0,
      0,
      W,
      H
    );


    particles =
      particles.filter(
        (p) =>
          p.life < p.max &&
          p.y < H + 40
      );


    for (const p of particles) {

      p.vx *= p.drag;

      p.vy =
        p.vy * p.drag +
        p.gravity;

      p.wob += 0.08;

      p.x +=
        p.vx +
        Math.sin(p.wob) *
        0.4;

      p.y += p.vy;

      p.rot += p.vr;

      p.life++;


      const fade =
        Math.max(
          0,
          (
            p.life -
            p.max * 0.7
          ) /
          (p.max * 0.3)
        );


      drawParticle(
        p,
        1 - fade
      );
    }


    if (particles.length) {

      raf =
        requestAnimationFrame(
          tick
        );

    } else {

      raf = null;

      ctx.clearRect(
        0,
        0,
        W,
        H
      );
    }
  }


  /* ==========================================================
     MUSIC
     ========================================================== */

  const music =
    $("#bgMusic");

  const soundBtn =
    $("#soundBtn");


  function syncSoundButton() {

    if (!soundBtn) return;

    const playing =
      music &&
      !music.paused;


    soundBtn.classList.toggle(
      "is-muted",
      !playing
    );


    soundBtn.setAttribute(
      "aria-pressed",
      String(playing)
    );


    soundBtn.setAttribute(
      "aria-label",
      playing
        ? "Turn music off"
        : "Turn music on"
    );
  }


  if (music) {

    music.addEventListener(
      "play",
      syncSoundButton
    );

    music.addEventListener(
      "pause",
      syncSoundButton
    );


    const src =
      $("source", music);


    if (src) {

      src.addEventListener(
        "error",
        () => {

          if (soundBtn) {
            soundBtn.hidden = true;
          }
        }
      );
    }
  }


  if (soundBtn) {

    soundBtn.addEventListener(
      "click",
      () => {

        if (!music) return;


        if (music.paused) {

          const p =
            music.play();

          if (
            p &&
            p.catch
          ) {
            p.catch(() => {});
          }

        } else {

          music.pause();
        }
      }
    );
  }


  /* ==========================================================
     VIDEO
     ========================================================== */

  const video =
    $("#heroVideo");

  let invitationOpen =
    false;


  function playVideo() {

    if (!video) return;

    video.muted = true;

    const p =
      video.play();

    if (
      p &&
      p.catch
    ) {
      p.catch(() => {});
    }
  }


  if (video) {

    video.addEventListener(
      "ended",
      () => {

        video.currentTime = 0;

        playVideo();
      }
    );


    video.addEventListener(
      "canplay",
      () => {

        if (
          invitationOpen &&
          video.paused
        ) {
          playVideo();
        }
      }
    );


    const vsrc =
      $("source", video);


    if (vsrc) {

      vsrc.addEventListener(
        "error",
        () => {
          video.style.display =
            "none";
        }
      );
    }
  }


  /* ==========================================================
     IMAGES
     ========================================================== */

  $$("img.frame__el").forEach(
    (img) => {

      const hide = () => {
        img.style.display =
          "none";
      };


      img.addEventListener(
        "error",
        hide
      );


      if (
        img.complete &&
        img.naturalWidth === 0
      ) {
        hide();
      }
    }
  );


  /* ==========================================================
     OPENING PAGE
     ========================================================== */

  const welcome =
    $("#welcome");

  const openBtn =
    $("#openBtn");

  const main =
    $("#invitation");


  function setupReveal() {

    const items =
      $$("[data-reveal]");


    if (
      !(
        "IntersectionObserver"
        in window
      )
    ) {

      items.forEach(
        (el) =>
          el.classList.add(
            "is-in"
          )
      );

      return;
    }


    const io =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "is-in"
                );

                io.unobserve(
                  entry.target
                );
              }
            }
          );
        },
        {
          threshold: 0.15,
          rootMargin:
            "0px 0px -6% 0px"
        }
      );


    items.forEach(
      (el) =>
        io.observe(el)
    );
  }


  function openInvitation() {

    if (invitationOpen)
      return;

    invitationOpen = true;


    /* Music */

    if (music) {

      music.volume = 0.85;

      const p =
        music.play();

      if (
        p &&
        p.catch
      ) {
        p.catch(
          () =>
            syncSoundButton()
        );
      }
    }


    /* Heart burst */

    if (openBtn) {

      const r =
        openBtn.getBoundingClientRect();


      burst(
        r.left +
          r.width / 2,

        r.top +
          r.height / 2,

        {
          count: 80,
          power: 10,

          kinds: [
            "heart",
            "petal",
            "petal",
            "circle"
          ],
        }
      );
    }


    /* Fade opening */

    if (welcome) {

      welcome.classList.add(
        "is-opening"
      );
    }


    if (openBtn) {

      openBtn.disabled =
        true;
    }


    /* Reveal invitation */

    window.setTimeout(
      () => {

        document.body.classList.remove(
          "is-locked"
        );


        window.scrollTo(
          0,
          0
        );


        if (main) {

          main.removeAttribute(
            "aria-hidden"
          );

          main.classList.add(
            "is-visible"
          );
        }


        if (video) {

          video.currentTime = 0;

          playVideo();
        }


        window.setTimeout(
          setupReveal,
          500
        );

      },
      900
    );


    /* Remove opening */

    window.setTimeout(
      () => {

        if (welcome) {
          welcome.hidden = true;
        }

      },
      2800
    );
  }


  if (openBtn) {

    openBtn.addEventListener(
      "click",
      openInvitation
    );
  }


  /* ==========================================================
     BIRTHDAY MESSAGE FORM
     GOOGLE SHEETS
     ========================================================== */

  const form =
    $("#wishForm");

  const letter =
    $("#letter");

  const thanks =
    $("#thanks");

  const errorEl =
    $("#formError");

  const sendBtn =
    $("#sendBtn");

  const againBtn =
    $("#againBtn");


  if (form) {

    form.addEventListener(
      "submit",
      async (event) => {

        event.preventDefault();


        const nameInput =
          $("#guestName");

        const messageInput =
          $("#guestMessage");


        const data = {

          name:
            nameInput
              ? nameInput.value.trim()
              : "",

          message:
            messageInput
              ? messageInput.value.trim()
              : "",

        };


        if (
          !data.name ||
          !data.message
        ) {

          if (
            form.reportValidity
          ) {
            form.reportValidity();
          }

          return;
        }


        if (errorEl) {
          errorEl.hidden = true;
        }


        if (sendBtn) {
          sendBtn.disabled = true;
        }


        try {

          /*
           * Send data to Google Apps Script.
           *
           * URLSearchParams is used instead
           * of JSON so Google Apps Script
           * receives e.parameter correctly.
           */

          const body =
            new URLSearchParams();


          body.append(
            "name",
            data.name
          );


          body.append(
            "message",
            data.message
          );


          await fetch(
            FORM_ENDPOINT,
            {
              method: "POST",

              body: body,

              mode: "no-cors"
            }
          );


          /* Success */

          if (letter) {

            letter.classList.add(
              "is-sent"
            );
          }


          if (thanks) {

            thanks.hidden = false;
          }


          /* Confetti */

          if (letter) {

            const box =
              letter.getBoundingClientRect();


            burst(
              box.left +
                box.width / 2,

              box.top +
                box.height * 0.35,

              {
                count: 50,
                power: 8,

                kinds: [
                  "heart",
                  "petal"
                ],
              }
            );
          }


        } catch (err) {

          console.error(
            "Message sending failed:",
            err
          );


          if (errorEl) {
            errorEl.hidden = false;
          }


        } finally {

          if (sendBtn) {
            sendBtn.disabled =
              false;
          }
        }
      }
    );
  }


  /* ==========================================================
     SEND ANOTHER MESSAGE
     ========================================================== */

  if (againBtn) {

    againBtn.addEventListener(
      "click",
      () => {

        if (form) {
          form.reset();
        }


        if (thanks) {
          thanks.hidden = true;
        }


        if (letter) {

          letter.classList.remove(
            "is-sent"
          );
        }


        const nameInput =
          $("#guestName");


        if (nameInput) {
          nameInput.focus();
        }
      }
    );
  }


  /* ==========================================================
     MAKE-A-WISH CANDLE
     ========================================================== */

  const cake =
    $("#cakeBtn");

  const wishHint =
    $("#wishHint");

  const wishText =
    $("#wishResult");

  const relight =
    $("#relightBtn");


  if (cake) {

    cake.addEventListener(
      "click",
      () => {

        if (
          cake.classList.contains(
            "is-out"
          )
        ) {
          return;
        }


        const flame =
          $(".flame", cake);


        if (flame) {

          const rect =
            flame.getBoundingClientRect();


          burst(
            rect.left +
              rect.width / 2,

            rect.top,

            {
              count: 100,
              power: 11,
              angle:
                -Math.PI / 2,
              spread:
                Math.PI * 1.2,
            }
          );
        }


        cake.classList.add(
          "is-out"
        );


        cake.setAttribute(
          "aria-label",
          "Candle blown out"
        );


        if (wishHint) {
          wishHint.hidden = true;
        }


        if (wishText) {

          wishText.textContent =
            "Wish made. May it come true.";
        }


        if (relight) {
          relight.hidden = false;
        }
      }
    );
  }


  if (relight) {

    relight.addEventListener(
      "click",
      () => {

        if (cake) {

          cake.classList.remove(
            "is-out"
          );


          cake.setAttribute(
            "aria-label",
            "Blow out the candle"
          );
        }


        if (wishHint) {
          wishHint.hidden = false;
        }


        if (wishText) {
          wishText.textContent = "";
        }


        relight.hidden = true;
      }
    );
  }


  /* ==========================================================
     INITIAL SOUND STATE
     ========================================================== */

  syncSoundButton();

})();
