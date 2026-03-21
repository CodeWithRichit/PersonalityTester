// Everything runs AFTER the full page has loaded
window.addEventListener("DOMContentLoaded", function () {

    // ── STEP 1: Read the URL to know which test to load ──
    let params   = new URLSearchParams(window.location.search);
    let testType = params.get("test");   // "16p" or "big5"

    // ── STEP 2: Pick the right question bank ─────────────
    let questions = [];

    if (testType === "16p") {
        questions = questions16P;
    } else if (testType === "big5") {
        questions = questionsBig5;
    } else {
        window.location.href = "index.html";
        return;
    }

    // ── STEP 3: Set up state variables ───────────────────
    let currentIndex = 0;
    let answers = [];
    for (let i = 0; i < questions.length; i++) {
        answers.push(null);
    }

    // ── STEP 4: Set the heading based on test type ────────
    if (testType === "16p") {
        document.getElementById("test-label").textContent = "16 Personalities Test";
        document.getElementById("quiz-title").textContent = "Discover Your Personality Type";
    } else {
        document.getElementById("test-label").textContent = "Big 5 Personality Test";
        document.getElementById("quiz-title").textContent = "Discover Your Trait Profile";
    }

    // ── STEP 5: Show a question on screen ─────────────────
    function showQuestion() {
        let q = questions[currentIndex];

        document.getElementById("question-number").textContent = "Question " + (currentIndex + 1) + " of " + questions.length;
        document.getElementById("question-text").textContent   = q.text;

        // update progress bar
        let percent = ((currentIndex + 1) / questions.length) * 100;
        document.getElementById("progress-bar").style.width  = percent + "%";
        document.getElementById("progress-text").textContent = (currentIndex + 1) + " / " + questions.length;

        // clear all radio buttons
        let radios = document.querySelectorAll('input[name="answer"]');
        for (let i = 0; i < radios.length; i++) {
            radios[i].checked = false;
        }

        // restore saved answer if user came back
        if (answers[currentIndex] !== null) {
            let saved = document.querySelector('input[name="answer"][value="' + answers[currentIndex] + '"]');
            if (saved) saved.checked = true;
        }

        // disable Back on first question
        document.getElementById("prev-btn").disabled = (currentIndex === 0);

        // change button text on last question
        if (currentIndex === questions.length - 1) {
            document.getElementById("next-btn").textContent = "Submit ✓";
        } else {
            document.getElementById("next-btn").textContent = "Next →";
        }
    }

    // ── STEP 6: Next button ───────────────────────────────
    document.getElementById("next-btn").addEventListener("click", function () {
        let selected = document.querySelector('input[name="answer"]:checked');

        if (selected === null) {
            alert("Please select an answer before continuing.");
            return;
        }

        answers[currentIndex] = parseInt(selected.value);

        if (currentIndex < questions.length - 1) {
            currentIndex = currentIndex + 1;
            showQuestion();
        } else {
            showResults();
        }
    });

    // ── STEP 7: Back button ───────────────────────────────
    document.getElementById("prev-btn").addEventListener("click", function () {
        if (currentIndex > 0) {
            currentIndex = currentIndex - 1;
            showQuestion();
        }
    });

    // ── STEP 8: Calculate and display results ─────────────
    function showResults() {
        document.getElementById("quiz-screen").classList.add("hidden");

        if (testType === "16p") {
            let type = score16P(questions, answers);
            let data = results16P[type];

            document.getElementById("result-emoji").textContent       = data.emoji;
            document.getElementById("result-type").textContent        = type;
            document.getElementById("result-title").textContent       = data.title;
            document.getElementById("result-description").textContent = data.description;
            document.getElementById("result-tip").textContent         = data.tip;

            // famous people tags
            let famousContainer = document.getElementById("result-famous");
            famousContainer.innerHTML = "";
            for (let i = 0; i < data.famous.length; i++) {
                let tag = document.createElement("span");
                tag.className   = "famous-tag";
                tag.textContent = data.famous[i];
                famousContainer.appendChild(tag);
            }

            document.getElementById("result-16p-screen").classList.remove("hidden");

        } else {
            let profile = scoreBig5(questions, answers);

            let traitNames = {
                O: "Openness",
                C: "Conscientiousness",
                E: "Extraversion",
                A: "Agreeableness",
                N: "Neuroticism"
            };

            let container = document.getElementById("big5-traits");
            container.innerHTML = "";

            let traits = ["O", "C", "E", "A", "N"];

            for (let i = 0; i < traits.length; i++) {
                let trait = traits[i];
                let level = profile[trait];
                let data  = resultsBig5[trait][level];

                let card = document.createElement("div");
                card.className = "trait-card";

                card.innerHTML =
                    '<div class="trait-header">' +
                        '<span class="trait-name">' + traitNames[trait] + '</span>' +
                        '<span class="trait-level ' + level + '">' + data.label + '</span>' +
                    '</div>' +
                    '<p class="trait-description">' + data.description + '</p>' +
                    '<p class="trait-tip">💡 ' + data.tip + '</p>';

                container.appendChild(card);
            }

            document.getElementById("result-big5-screen").classList.remove("hidden");
        }

        window.scrollTo(0, 0);
    }

    // ── STEP 9: Retake button ─────────────────────────────
    document.getElementById("result-16p-screen")
        .querySelector(".action-btn")
        .addEventListener("click", function () {
            currentIndex = 0;
            for (let i = 0; i < answers.length; i++) answers[i] = null;
            document.getElementById("result-16p-screen").classList.add("hidden");
            document.getElementById("quiz-screen").classList.remove("hidden");
            showQuestion();
            window.scrollTo(0, 0);
        });

    document.getElementById("result-big5-screen")
        .querySelector(".action-btn")
        .addEventListener("click", function () {
            currentIndex = 0;
            for (let i = 0; i < answers.length; i++) answers[i] = null;
            document.getElementById("result-big5-screen").classList.add("hidden");
            document.getElementById("quiz-screen").classList.remove("hidden");
            showQuestion();
            window.scrollTo(0, 0);
        });

    // ── STEP 10: Kick everything off ─────────────────────
    showQuestion();

}); // end DOMContentLoaded