/* =========================================
   WEDDING INVITATION WEBSITE
   JavaScript Functionality
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // 1. ELEMENTS
    const intro = document.getElementById("intro");
    const envelope = document.getElementById("envelope");
    const openInvitation = document.getElementById("openInvitation");
    const weddingSite = document.getElementById("weddingSite");

    // 2. ENVELOPE OPENING
    if (intro && envelope && openInvitation) {
        openInvitation.addEventListener("click", () => {
            if (openInvitation.disabled) return;

            openInvitation.disabled = true;
            envelope.classList.add("open");
            openInvitation.textContent = "Opening Your Invitation...";

            window.setTimeout(() => {
                intro.classList.add("hide");
                document.body.classList.remove("locked");

                if (weddingSite) {
                    weddingSite.classList.add("is-open");
                }

                startRevealObserver();

                window.setTimeout(() => {
                    intro.style.display = "none";
                }, 1000);
            }, 850);
        });
    }

    // 3. GOLD PARTICLES
    function createGoldParticles() {
        const container = document.getElementById("goldParticles");

        if (!container) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        container.innerHTML = "";

        const count = window.innerWidth < 600 ? 18 : 35;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement("span");

            particle.className = "gold-particle";
            particle.style.setProperty("--x", `${Math.random() * 100}%`);
            particle.style.setProperty("--size", `${Math.random() * 4 + 2}px`);
            particle.style.setProperty("--duration", `${Math.random() * 8 + 7}s`);
            particle.style.setProperty("--delay", `${Math.random() * -15}s`);
            particle.style.setProperty("--drift", `${Math.random() * 120 - 60}px`);
            particle.style.setProperty("--opacity", Math.random() * 0.5 + 0.3);

            container.appendChild(particle);
        }
    }

    createGoldParticles();

    // 4. WEDDING COUNTDOWN
    const weddingDate = new Date("2026-12-17T20:00:00+05:30").getTime();

    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    function updateCountdown() {
        if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
            return;
        }

        const difference = weddingDate - Date.now();

        if (difference <= 0) {
            daysElement.textContent = "00";
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            secondsElement.textContent = "00";
            return;
        }

        daysElement.textContent = String(
            Math.floor(difference / 86400000)
        ).padStart(2, "0");

        hoursElement.textContent = String(
            Math.floor((difference / 3600000) % 24)
        ).padStart(2, "0");

        minutesElement.textContent = String(
            Math.floor((difference / 60000) % 60)
        ).padStart(2, "0");

        secondsElement.textContent = String(
            Math.floor((difference / 1000) % 60)
        ).padStart(2, "0");
    }

    updateCountdown();
    window.setInterval(updateCountdown, 1000);

    // 5. SCROLL REVEAL
    let revealObserver = null;

    function startRevealObserver() {
        const elements = document.querySelectorAll(".reveal");

        if (!("IntersectionObserver" in window)) {
            elements.forEach(element => {
                element.classList.add("is-visible");
            });
            return;
        }

        if (revealObserver) {
            revealObserver.disconnect();
        }

        revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        });

        elements.forEach(element => revealObserver.observe(element));
    }

    startRevealObserver();

    // 6. SCRATCH CARD
    const scratchCard = document.getElementById("scratchCard");
    const scratchCanvas = document.getElementById("scratchCanvas");
    const scratchInstruction = document.getElementById("scratchInstruction");

    if (scratchCard && scratchCanvas) {
        const ctx = scratchCanvas.getContext("2d");

        if (ctx) {
            let isScratching = false;
            let isRevealed = false;
            let lastPoint = null;

            function setupScratchCard() {
                if (isRevealed) return;

                const rect = scratchCanvas.getBoundingClientRect();

                if (!rect.width || !rect.height) return;

                const ratio = Math.min(window.devicePixelRatio || 1, 2);

                scratchCanvas.width = Math.round(rect.width * ratio);
                scratchCanvas.height = Math.round(rect.height * ratio);

                ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

                const gradient = ctx.createLinearGradient(
                    0, 0, rect.width, rect.height
                );

                gradient.addColorStop(0, "#b38b48");
                gradient.addColorStop(0.35, "#e5cb91");
                gradient.addColorStop(0.65, "#c4a15d");
                gradient.addColorStop(1, "#9b753a");

                ctx.globalCompositeOperation = "source-over";
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, rect.width, rect.height);

                ctx.strokeStyle = "rgba(255,255,255,0.24)";
                ctx.lineWidth = 1;

                for (let x = -rect.height; x < rect.width; x += 24) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x + rect.height, rect.height);
                    ctx.stroke();
                }

                ctx.fillStyle = "#fff8e8";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = "600 12px Montserrat, Arial, sans-serif";
                ctx.fillText("SCRATCH TO REVEAL", rect.width / 2, rect.height / 2 - 12);

                ctx.font = "24px Georgia, serif";
                ctx.fillText("✦", rect.width / 2, rect.height / 2 + 20);

                if (scratchInstruction) {
                    scratchInstruction.style.opacity = "1";
                }
            }

            function getPosition(event) {
                const rect = scratchCanvas.getBoundingClientRect();

                return {
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top
                };
            }

            function scratchAt(point) {
                if (isRevealed) return;

                ctx.globalCompositeOperation = "destination-out";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 35;

                ctx.beginPath();

                if (lastPoint) {
                    ctx.moveTo(lastPoint.x, lastPoint.y);
                } else {
                    ctx.moveTo(point.x, point.y);
                }

                ctx.lineTo(point.x, point.y);
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(point.x, point.y, 17, 0, Math.PI * 2);
                ctx.fill();

                lastPoint = point;
            }

            function getScratchPercentage() {
                const width = scratchCanvas.width;
                const height = scratchCanvas.height;

                if (!width || !height) return 0;

                try {
                    const pixels = ctx.getImageData(0, 0, width, height).data;
                    const step = 16;

                    let transparent = 0;
                    let total = 0;

                    for (let i = 3; i < pixels.length; i += step) {
                        total++;

                        if (pixels[i] < 100) {
                            transparent++;
                        }
                    }

                    return total ? (transparent / total) * 100 : 0;
                } catch (error) {
                    console.error("Scratch-card check failed:", error);
                    return 0;
                }
            }

            function revealScratchCard() {
                if (isRevealed) return;

                isRevealed = true;
                isScratching = false;
                lastPoint = null;

                scratchCard.classList.add("scratching");

                if (scratchInstruction) {
                    scratchInstruction.style.display = "none";
                }

                ctx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
                scratchCanvas.style.transition = "opacity 0.4s ease";
                scratchCanvas.style.opacity = "0";
                scratchCanvas.style.pointerEvents = "none";
            }

            scratchCanvas.addEventListener("pointerdown", event => {
                if (isRevealed) return;

                isScratching = true;
                lastPoint = getPosition(event);

                scratchCard.classList.add("scratching");

                if (scratchInstruction) {
                    scratchInstruction.style.opacity = "0";
                }

                if (scratchCanvas.setPointerCapture) {
                    scratchCanvas.setPointerCapture(event.pointerId);
                }

                scratchAt(lastPoint);
                event.preventDefault();
            });

            scratchCanvas.addEventListener("pointermove", event => {
                if (!isScratching || isRevealed) return;

                scratchAt(getPosition(event));

                if (getScratchPercentage() >= 35) {
                    revealScratchCard();
                }

                event.preventDefault();
            });

            function stopScratching() {
                if (!isScratching) return;

                isScratching = false;
                lastPoint = null;

                if (!isRevealed && getScratchPercentage() >= 25) {
                    revealScratchCard();
                }
            }

            scratchCanvas.addEventListener("pointerup", stopScratching);
            scratchCanvas.addEventListener("pointercancel", stopScratching);
            scratchCanvas.addEventListener("lostpointercapture", stopScratching);

            setupScratchCard();

            window.addEventListener("resize", setupScratchCard);
        }
    }

    // 7. GALLERY CAROUSEL — MULTI-CARD RESPONSIVE CAROUSEL WITH AUTO-SCROLL
    const galleryCardsTrack = document.getElementById("galleryCardsTrack");
    const prevPhotoBtn = document.getElementById("prevPhoto");
    const nextPhotoBtn = document.getElementById("nextPhoto");
    const galleryCards = document.querySelectorAll(".gallery-photo-card");

    let galleryAutoTimer = null;
    const GALLERY_AUTO_DELAY = 3800;

    function getCardScrollStep() {
        if (!galleryCardsTrack) return 300;
        const firstCard = galleryCardsTrack.querySelector(".gallery-photo-card");
        if (firstCard) {
            return firstCard.offsetWidth + 24;
        }
        return 300;
    }

    function scrollGallery(direction = 1) {
        if (!galleryCardsTrack) return;
        const step = getCardScrollStep() * direction;
        const maxScroll = galleryCardsTrack.scrollWidth - galleryCardsTrack.clientWidth;

        // If at end and scrolling forward, wrap to start
        if (direction > 0 && galleryCardsTrack.scrollLeft >= maxScroll - 15) {
            galleryCardsTrack.scrollTo({ left: 0, behavior: "smooth" });
        } else if (direction < 0 && galleryCardsTrack.scrollLeft <= 15) {
            galleryCardsTrack.scrollTo({ left: maxScroll, behavior: "smooth" });
        } else {
            galleryCardsTrack.scrollBy({ left: step, behavior: "smooth" });
        }
    }

    function startGalleryAutoScroll() {
        stopGalleryAutoScroll();
        galleryAutoTimer = window.setInterval(() => {
            scrollGallery(1);
        }, GALLERY_AUTO_DELAY);
    }

    function stopGalleryAutoScroll() {
        if (galleryAutoTimer) {
            window.clearInterval(galleryAutoTimer);
            galleryAutoTimer = null;
        }
    }

    if (galleryCardsTrack) {
        if (prevPhotoBtn) {
            prevPhotoBtn.addEventListener("click", () => {
                scrollGallery(-1);
                stopGalleryAutoScroll();
                startGalleryAutoScroll();
            });
        }

        if (nextPhotoBtn) {
            nextPhotoBtn.addEventListener("click", () => {
                scrollGallery(1);
                stopGalleryAutoScroll();
                startGalleryAutoScroll();
            });
        }

        // Pause on user hover or touch interaction
        galleryCardsTrack.addEventListener("mouseenter", stopGalleryAutoScroll);
        galleryCardsTrack.addEventListener("mouseleave", startGalleryAutoScroll);
        galleryCardsTrack.addEventListener("touchstart", stopGalleryAutoScroll, { passive: true });
        galleryCardsTrack.addEventListener("touchend", startGalleryAutoScroll, { passive: true });

        // Highlight card on click
        galleryCards.forEach(card => {
            card.addEventListener("click", () => {
                galleryCards.forEach(c => c.classList.remove("is-active"));
                card.classList.add("is-active");
            });
        });

        // Start auto scroll
        startGalleryAutoScroll();
    }

    // 7B. ROYAL TIMELINE SCROLL OBSERVER — DYNAMIC DOT HIGHLIGHT ON SCROLL
    function initTimelineScrollObserver() {
        const timelineRows = document.querySelectorAll(".timeline-event-row");
        if (!timelineRows.length) return;

        if ("IntersectionObserver" in window) {
            const observerOptions = {
                root: null,
                rootMargin: "-15% 0px -25% 0px",
                threshold: [0.15, 0.4, 0.7]
            };

            const timelineObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-active");
                    } else {
                        const bounding = entry.boundingClientRect;
                        if (bounding.top > window.innerHeight || bounding.bottom < 0) {
                            entry.target.classList.remove("is-active");
                        }
                    }
                });
            }, observerOptions);

            timelineRows.forEach(row => timelineObserver.observe(row));
        } else {
            timelineRows.forEach(row => row.classList.add("is-active"));
        }
    }

    initTimelineScrollObserver();

    // 8. RSVP FORM
    const rsvpForm = document.getElementById("rsvpForm");
    const rsvpMessage = document.getElementById("rsvpMessage");

    if (rsvpForm) {
        rsvpForm.addEventListener("submit", event => {
            event.preventDefault();

            if (!rsvpForm.reportValidity()) return;

            const guestName = document.getElementById("guestName")?.value.trim();
            const guestCount = document.getElementById("guestCount")?.value;
            const attendance = document.getElementById("attendance")?.value;

            if (!guestName || !guestCount || !attendance) {
                if (rsvpMessage) {
                    rsvpMessage.textContent = "Please complete all fields.";
                }
                return;
            }

            if (rsvpMessage) {
                if (attendance === "Yes") {
                    const guestLabel = Number(guestCount) === 1 ? "guest" : "guests";

                    rsvpMessage.textContent =
                        `Thank you, ${guestName}! We look forward to celebrating with you (${guestCount} ${guestLabel}).`;
                } else {
                    rsvpMessage.textContent =
                        `Thank you for letting us know, ${guestName}. You will be missed!`;
                }
            }

            // Demo only: RSVP is not stored or sent to anyone.
        });
    }

    // 9. SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "auto"
                    : "smooth",
                block: "start"
            });
        });
    });
});

// =========================================
// 1. INVITATION CARD 3D INTERACTIVE TILT
// =========================================
const invitationCard = document.getElementById("invitationCard");
const invitationWrapper = document.querySelector(".invitation-card-container");

if (invitationCard && invitationWrapper) {
    let tiltRafId = null;

    invitationWrapper.addEventListener("mousemove", event => {
        if (tiltRafId) cancelAnimationFrame(tiltRafId);

        tiltRafId = requestAnimationFrame(() => {
            const rect = invitationCard.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((centerY - y) / centerY) * 5.5;
            const rotateY = ((x - centerX) / centerX) * 5.5;

            invitationCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        });
    });

    invitationWrapper.addEventListener("mouseleave", () => {
        if (tiltRafId) cancelAnimationFrame(tiltRafId);
        invitationCard.style.transform = "";
    });
}

// =========================================
// 2. CELEBRATION CONFETTI EFFECT
// =========================================
function launchWeddingConfetti() {
    const confettiContainer = document.createElement("div");
    confettiContainer.style.position = "fixed";
    confettiContainer.style.inset = "0";
    confettiContainer.style.pointerEvents = "none";
    confettiContainer.style.zIndex = "9999";
    confettiContainer.style.overflow = "hidden";
    document.body.appendChild(confettiContainer);

    const colors = ["#d4af37", "#f3eadb", "#b89555", "#fffdf8", "#e5c57b", "#ffdd80"];
    const totalConfetti = 45;

    for (let i = 0; i < totalConfetti; i++) {
        const piece = document.createElement("div");
        const size = Math.random() * 8 + 6;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;

        piece.style.position = "absolute";
        piece.style.top = "-20px";
        piece.style.left = `${left}%`;
        piece.style.width = `${size}px`;
        piece.style.height = `${size * (Math.random() > 0.5 ? 1 : 1.6)}px`;
        piece.style.backgroundColor = color;
        piece.style.borderRadius = Math.random() > 0.4 ? "50%" : "2px";
        piece.style.boxShadow = "0 0 6px rgba(212, 175, 55, 0.4)";
        piece.style.opacity = "0.9";
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;

        const duration = Math.random() * 2 + 2.5;
        const delay = Math.random() * 0.8;

        piece.animate([
            { transform: `translate3d(0, 0, 0) rotate(0deg)`, opacity: 1 },
            { transform: `translate3d(${Math.sin(i) * 90}px, 100vh, 0) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            delay: delay * 1000,
            easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            fill: "forwards"
        });

        confettiContainer.appendChild(piece);
    }

    setTimeout(() => {
        confettiContainer.remove();
    }, 4500);
}

// Sparkle dust particle while scratching
function createScratchSparkle(x, y, parent) {
    if (!parent) return;
    const sparkle = document.createElement("span");
    sparkle.innerText = Math.random() > 0.5 ? "✨" : "✦";
    sparkle.style.position = "absolute";
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.color = "#b89555";
    sparkle.style.fontSize = `${Math.random() * 10 + 10}px`;
    sparkle.style.pointerEvents = "none";
    sparkle.style.zIndex = "20";
    sparkle.style.transition = "transform 0.6s ease-out, opacity 0.6s ease-out";
    sparkle.style.transform = "translate(-50%, -50%) scale(1)";
    parent.appendChild(sparkle);

    requestAnimationFrame(() => {
        const deltaX = (Math.random() - 0.5) * 35;
        const deltaY = -Math.random() * 30 - 10;
        sparkle.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(0.3) rotate(${Math.random() * 90}deg)`;
        sparkle.style.opacity = "0";
    });

    setTimeout(() => sparkle.remove(), 600);
}

// =========================================
// 3. COUNTDOWN SCRATCH CARD ENGINE (IMPROVED)
// =========================================
const countdownScratchCard = document.getElementById("countdownScratchCard");
const countdownScratchCanvas = document.getElementById("countdownScratchCanvas");

let globalSetupCountdownScratch = null;

if (countdownScratchCard && countdownScratchCanvas) {
    const ctx = countdownScratchCanvas.getContext("2d", { willReadFrequently: true });

    if (ctx) {
        let isScratching = false;
        let isRevealed = false;
        let lastPoint = null;
        let startPoint = null;
        let sparkleCounter = 0;
        let movedDistance = 0;

        function setupCountdownScratch() {
            if (isRevealed) return;

            const rect = countdownScratchCard.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            countdownScratchCanvas.width = Math.round(rect.width * ratio);
            countdownScratchCanvas.height = Math.round(rect.height * ratio);

            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            ctx.globalCompositeOperation = "source-over";

            // Rich Champagne Metallic Gold Foil Gradient
            const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
            gradient.addColorStop(0, "#fcf6ec");
            gradient.addColorStop(0.3, "#ebd3a6");
            gradient.addColorStop(0.65, "#dfbe85");
            gradient.addColorStop(1, "#cca15e");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, rect.width, rect.height);

            // Subtle Gold Foil Diagonal Texture Lines
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctx.lineWidth = 1;
            for (let x = -rect.height; x < rect.width + rect.height; x += 22) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x + rect.height, rect.height);
                ctx.stroke();
            }

            // Outer & Inner Gold Foil Borders
            ctx.strokeStyle = "rgba(145, 105, 45, 0.4)";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(9, 9, rect.width - 18, rect.height - 18);

            ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
            ctx.lineWidth = 1;
            ctx.strokeRect(13, 13, rect.width - 26, rect.height - 26);

            // Center Ornamental Icon
            ctx.save();
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Center Sparkle Motif
            ctx.font = "26px Georgia, serif";
            ctx.fillStyle = "#6d4a1b";
            ctx.shadowColor = "rgba(255, 255, 255, 0.75)";
            ctx.shadowOffsetY = 1;
            ctx.fillText("✦", rect.width / 2, rect.height / 2 - 24);

            // Primary Instruction - Dark, Bold, Super Crisp & Readable!
            ctx.font = "700 13px 'Montserrat', Arial, sans-serif";
            ctx.fillStyle = "#36220d";
            ctx.shadowColor = "rgba(255, 255, 255, 0.85)";
            ctx.shadowOffsetY = 1;
            ctx.shadowBlur = 1;
            ctx.letterSpacing = "2.5px";
            ctx.fillText("✦  SCRATCH TO REVEAL  ✦", rect.width / 2, rect.height / 2 + 6);

            // Subtitle Guidance - Clear & Readable
            ctx.font = "500 11px 'Montserrat', Arial, sans-serif";
            ctx.fillStyle = "#553a1a";
            ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
            ctx.shadowOffsetY = 1;
            ctx.letterSpacing = "1px";
            ctx.fillText("Tap or drag to uncover", rect.width / 2, rect.height / 2 + 28);
            ctx.restore();
        }

        globalSetupCountdownScratch = setupCountdownScratch;

        function getCountdownScratchPosition(event) {
            const rect = countdownScratchCanvas.getBoundingClientRect();
            let clientX = event.clientX;
            let clientY = event.clientY;

            if (event.touches && event.touches[0]) {
                clientX = event.touches[0].clientX;
                clientY = event.touches[0].clientY;
            }

            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }

        function scratchCountdownAt(point) {
            if (isRevealed) return;

            ctx.globalCompositeOperation = "destination-out";
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineWidth = 48;

            ctx.beginPath();
            if (lastPoint) {
                ctx.moveTo(lastPoint.x, lastPoint.y);
            } else {
                ctx.moveTo(point.x, point.y);
            }
            ctx.lineTo(point.x, point.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(point.x, point.y, 24, 0, Math.PI * 2);
            ctx.fill();

            // Emit sparkle effect
            sparkleCounter++;
            if (sparkleCounter % 3 === 0) {
                createScratchSparkle(point.x, point.y, countdownScratchCard);
            }

            lastPoint = point;
        }

        function getCountdownScratchPercentage() {
            const width = countdownScratchCanvas.width;
            const height = countdownScratchCanvas.height;
            if (!width || !height) return 0;

            try {
                const pixels = ctx.getImageData(0, 0, width, height).data;
                let transparentPixels = 0;
                let totalPixels = 0;

                for (let i = 3; i < pixels.length; i += 64) {
                    totalPixels++;
                    if (pixels[i] < 120) {
                        transparentPixels++;
                    }
                }

                return totalPixels ? (transparentPixels / totalPixels) * 100 : 0;
            } catch (error) {
                console.error("Countdown scratch error:", error);
                return 0;
            }
        }

        function revealCountdown() {
            if (isRevealed) return;
            isRevealed = true;
            isScratching = false;
            lastPoint = null;

            countdownScratchCard.classList.add("is-revealed");
            countdownScratchCanvas.style.transition = "opacity 0.6s ease";
            countdownScratchCanvas.style.opacity = "0";
            countdownScratchCanvas.style.pointerEvents = "none";

            setTimeout(() => {
                ctx.clearRect(0, 0, countdownScratchCanvas.width, countdownScratchCanvas.height);
            }, 650);

            // Celebration Confetti!
            launchWeddingConfetti();
        }

        // Pointer event scratching
        countdownScratchCanvas.addEventListener("pointerdown", event => {
            if (isRevealed) return;
            isScratching = true;
            lastPoint = null;
            movedDistance = 0;
            startPoint = getCountdownScratchPosition(event);

            if (countdownScratchCanvas.setPointerCapture) {
                countdownScratchCanvas.setPointerCapture(event.pointerId);
            }

            scratchCountdownAt(startPoint);
            event.preventDefault();
        });

        countdownScratchCanvas.addEventListener("pointermove", event => {
            if (!isScratching || isRevealed) return;
            const pt = getCountdownScratchPosition(event);

            if (startPoint) {
                const dx = pt.x - startPoint.x;
                const dy = pt.y - startPoint.y;
                movedDistance += Math.sqrt(dx * dx + dy * dy);
            }

            scratchCountdownAt(pt);

            if (getCountdownScratchPercentage() >= 18) {
                revealCountdown();
            }
            event.preventDefault();
        });

        function stopCountdownScratching() {
            if (!isScratching) return;
            isScratching = false;

            // If user simply clicked or tapped with little movement, uncover easily!
            if (!isRevealed && movedDistance < 10) {
                revealCountdown();
                return;
            }

            if (!isRevealed && getCountdownScratchPercentage() >= 15) {
                revealCountdown();
            }
            lastPoint = null;
        }

        countdownScratchCanvas.addEventListener("pointerup", stopCountdownScratching);
        countdownScratchCanvas.addEventListener("pointercancel", stopCountdownScratching);
        countdownScratchCanvas.addEventListener("lostpointercapture", stopCountdownScratching);

        // Click on scratch canvas directly reveals if tapped
        countdownScratchCanvas.addEventListener("click", () => {
            if (!isRevealed) revealCountdown();
        });

        // Initialize scratch layer
        setupCountdownScratch();

        // Re-setup on resize
        window.addEventListener("resize", () => {
            if (!isRevealed) setupCountdownScratch();
        });

        // Also re-setup when countdown section enters viewport
        if ("IntersectionObserver" in window) {
            const countdownObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !isRevealed) {
                        setupCountdownScratch();
                    }
                });
            }, { threshold: 0.1 });
            countdownObserver.observe(countdownScratchCard);
        }
    }
}


/* ===== VIDEO INTRO CONTROLLER ===== */

const intro = document.getElementById("intro");
const introVideo = document.getElementById("introVideo");
const weddingSite = document.getElementById("weddingSite");
const skipIntro = document.getElementById("skipIntro");

let introFinished = false;
let introTimer;

function finishIntro() {
    if (introFinished) return;

    introFinished = true;
    clearTimeout(introTimer);

    if (intro) {
        intro.classList.add("hide");
    }

    document.body.classList.remove("locked");

    if (weddingSite) {
        weddingSite.classList.add("is-open");
    }

    if (typeof startRevealObserver === "function") {
        startRevealObserver();
    }

    window.setTimeout(() => {
        if (intro) {
            intro.style.display = "none";
        }
    }, 850);
}

if (intro && introVideo) {
    // Continue when video ends
    introVideo.addEventListener("ended", finishIntro, { once: true });

    // Show the website after 6 seconds even if video is longer
    introTimer = window.setTimeout(finishIntro, 6000);

    // If the video fails to load, don't block the website
    introVideo.addEventListener("error", finishIntro, { once: true });

    // Start playback; muted video supports autoplay in most browsers
    const playPromise = introVideo.play();

    if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
            // Keep the 6-second fallback so the site can still open
        });
    }
}

if (skipIntro) {
    skipIntro.addEventListener("click", finishIntro);
}
