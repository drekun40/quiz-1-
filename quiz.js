// Hardcoded questions and answers
const questions = [
    {
        type: "multiple-choice",
        text: "Look at the graph below. What is the slope of the line?",
        choices: ["positive", "negative", "zero", "undefined"],
        answer: "positive",
        plot: true,
        explanation: "The line goes upwards as x increases, so the slope is positive."
    },
    {
        type: "multiple-choice",
        text: "Look at the graph below. What is the slope of the line?",
        choices: ["positive", "negative", "zero", "undefined"],
        answer: "undefined",
        plot: "vertical",
        explanation: "The line x = 5 is vertical, so its slope is undefined."
    },
    {
        type: "multiple-choice",
        text: "Look at the graph below. What is the slope of the line?",
        choices: ["positive", "negative", "zero", "undefined"],
        answer: "negative",
        plot: "negative",
        explanation: "The line y = -3x - 2 goes down as x increases, so the slope is negative."
    },
    {
        type: "interactive-slope",
        text: "Move the line below to make it have either a positive or negative slope. Then select which slope you made.",
        choices: ["positive", "negative"],
        answer: "positive", // default correct answer, but will check against student's selection
        plot: "draggable",
        explanation: "A line with a positive slope goes up as x increases, negative goes down. Drag the line to change its slope, then select your answer."
    },
    {
        type: "multiple-choice",
        text: "Look at the graph below. What is the slope of the line?",
        choices: ["positive", "negative", "zero", "undefined"],
        answer: "positive",
        plot: "positive2",
        explanation: "The line y = 0.5x - 4 goes up as x increases, so the slope is positive."
    }
];

let currentQuestion = 0;
let userAnswers = Array(questions.length).fill("");

const questionContainer = document.getElementById('question-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const solutionContainer = document.getElementById('solution-container');

function renderQuestion() {
    const q = questions[currentQuestion];
    let html = `<div class="question">
        <h3>Question ${currentQuestion + 1} of ${questions.length}</h3>
        <p>${q.text}</p>`;
    if (q.plot) {
        html += `<div id="plotly-graph" style="height:300px;"></div>`;
    }
    if (q.type === "multiple-choice") {
        html += `<div id="choices">`;
        q.choices.forEach((choice, idx) => {
            html += `<label class="choice-label"><input type="radio" name="answer" value="${choice}" ${userAnswers[currentQuestion] === choice ? "checked" : ""}> ${choice}</label><br>`;
        });
        html += `</div>`;
    } else {
        html += `<input type="text" id="answer-input" value="${userAnswers[currentQuestion]}">`;
    }
    html += `</div>`;
    questionContainer.innerHTML = html;
    if (q.plot) {
        if (q.plot === "vertical") {
            plotVerticalLine();
        } else if (q.plot === "negative") {
            plotNegativeLine();
        } else if (q.plot === "horizontal") {
            plotHorizontalLine();
        } else if (q.plot === "positive2") {
            plotPositive2Line();
        } else if (q.plot === "draggable") {
            plotDraggableLine();
        } else {
            plotGraph();
        }
    }
    if (q.type === "interactive-slope") {
        // Add slope selection UI
        let slopeHtml = `<div id="choices" style="margin-top:16px;">`;
        q.choices.forEach((choice, idx) => {
            slopeHtml += `<label class="choice-label"><input type="radio" name="answer" value="${choice}" ${userAnswers[currentQuestion] === choice ? "checked" : ""}> ${choice}</label><br>`;
        });
        slopeHtml += `</div>`;
        questionContainer.innerHTML += slopeHtml;
        document.querySelectorAll('input[name="answer"]').forEach(input => {
            input.addEventListener('change', (e) => {
                userAnswers[currentQuestion] = e.target.value;
                checkAllAnswered();
            });
        });
    }
function plotDraggableLine() {
    // Initial line: y = m*x + b, m = 1, b = 0
    let m = 1;
    let b = 0;
    const x = [-5, 5];
    const y = [m * x[0] + b, m * x[1] + b];
    const trace = {
        x: x,
        y: y,
        mode: 'lines+markers',
        marker: {size: 10, color: '#ffc107'},
        line: {color: '#ffc107', width: 3},
    };
    const layout = {
        margin: {t: 10, r: 10, l: 40, b: 40},
        xaxis: {title: 'x', range: [-6, 6]},
        yaxis: {title: 'y', range: [-10, 10]},
        showlegend: false,
        dragmode: 'drawline',
        shapes: []
    };
    Plotly.newPlot('plotly-graph', [trace], layout, {displayModeBar: true, modeBarButtonsToAdd: ['drawline']});
    // Listen for line drawn event
    document.getElementById('plotly-graph').on('plotly_relayout', function(eventdata) {
        // Find the last drawn line
        const shapes = eventdata['shapes'] || [];
        if (shapes.length > 0) {
            const line = shapes[shapes.length - 1];
            // Calculate slope
            const dx = line.x1 - line.x0;
            const dy = line.y1 - line.y0;
            if (dx !== 0) {
                const slope = dy / dx;
                // Optionally, store slope for feedback
                window.currentSlope = slope;
            }
        }
    });
}
function plotNegativeLine() {
    // y = -3x - 2
    const x = [];
    const y = [];
    for (let i = -5; i <= 5; i++) {
        x.push(i);
        y.push(-3 * i - 2);
    }
    const trace = {
        x: x,
        y: y,
        mode: 'lines',
        line: {color: '#dc3545', width: 3}
    };
    Plotly.newPlot('plotly-graph', [trace], {
        margin: {t: 10, r: 10, l: 40, b: 40},
        xaxis: {title: 'x'},
        yaxis: {title: 'y'},
        showlegend: false
    }, {displayModeBar: false});
}

function plotHorizontalLine() {
    // y = 7, horizontal line
    const x = [-5, 5];
    const y = [7, 7];
    const trace = {
        x: x,
        y: y,
        mode: 'lines',
        line: {color: '#28a745', width: 3}
    };
    Plotly.newPlot('plotly-graph', [trace], {
        margin: {t: 10, r: 10, l: 40, b: 40},
        xaxis: {title: 'x'},
        yaxis: {title: 'y'},
        showlegend: false
    }, {displayModeBar: false});
}

function plotPositive2Line() {
    // y = 0.5x - 4
    const x = [];
    const y = [];
    for (let i = -5; i <= 5; i++) {
        x.push(i);
        y.push(0.5 * i - 4);
    }
    const trace = {
        x: x,
        y: y,
        mode: 'lines',
        line: {color: '#007bff', width: 3, dash: 'dot'}
    };
    Plotly.newPlot('plotly-graph', [trace], {
        margin: {t: 10, r: 10, l: 40, b: 40},
        xaxis: {title: 'x'},
        yaxis: {title: 'y'},
        showlegend: false
    }, {displayModeBar: false});
}
    if (q.type === "multiple-choice") {
        document.querySelectorAll('input[name="answer"]').forEach(input => {
            input.addEventListener('change', (e) => {
                userAnswers[currentQuestion] = e.target.value;
                checkAllAnswered();
            });
        });
    } else {
        document.getElementById('answer-input').addEventListener('input', (e) => {
            userAnswers[currentQuestion] = e.target.value;
            checkAllAnswered();
        });
    }
    prevBtn.classList.toggle('hidden', currentQuestion === 0);
    nextBtn.classList.toggle('hidden', currentQuestion === questions.length - 1);
}

function plotVerticalLine() {
    // x = 5, vertical line
    const x = [5, 5];
    const y = [-5, 15];
    const trace = {
        x: x,
        y: y,
        mode: 'lines',
        line: {color: '#e83e8c', width: 3}
    };
    Plotly.newPlot('plotly-graph', [trace], {
        margin: {t: 10, r: 10, l: 40, b: 40},
        xaxis: {title: 'x'},
        yaxis: {title: 'y'},
        showlegend: false
    }, {displayModeBar: false});
}
function plotGraph() {
    // y = 2x + 10, x from -5 to 5
    const x = [];
    const y = [];
    for (let i = -5; i <= 5; i++) {
        x.push(i);
        y.push(2 * i + 10);
    }
    const trace = {
        x: x,
        y: y,
        mode: 'lines',
        line: {color: '#007bff', width: 3}
    };
    Plotly.newPlot('plotly-graph', [trace], {
        margin: {t: 10, r: 10, l: 40, b: 40},
        xaxis: {title: 'x'},
        yaxis: {title: 'y'},
        showlegend: false
    }, {displayModeBar: false});
}

function checkAllAnswered() {
    const allAnswered = userAnswers.every(ans => ans.trim() !== "");
    submitBtn.classList.toggle('hidden', !allAnswered);
}

prevBtn.addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
    }
});

submitBtn.addEventListener('click', () => {
    showSolutions();
});

function showSolutions() {
    let score = 0;
    let html = '<h3>Solutions</h3>';
    questions.forEach((q, i) => {
        let correct;
        if (q.type === "multiple-choice") {
            correct = userAnswers[i] === q.answer;
        } else {
            correct = userAnswers[i].trim().toLowerCase() === q.answer.toLowerCase();
        }
        if (correct) score++;
        html += `<div>
            <strong>Q${i+1}: ${q.text}</strong><br>
            Your answer: <span style="color:${correct ? 'green' : 'red'}">${userAnswers[i]}</span><br>
            Correct answer: <strong>${q.answer}</strong><br>
            <span style="color:#555;font-size:0.98em;"><em>Explanation: ${q.explanation}</em></span>
        </div>`;
        if (q.plot) {
            html += `<div id="solution-plot-${i}" style="height:200px;"></div>`;
        }
        html += '<hr>';
    });
    const percent = Math.round((score / questions.length) * 100);
    const scoreColor = score === questions.length ? 'green' : 'red';
    html = `<div style="font-size:1.2em;margin-bottom:16px;color:${scoreColor};"><strong>Score: ${score} / ${questions.length} (${percent}%)</strong></div>` + html;
    solutionContainer.innerHTML = html;
    solutionContainer.classList.remove('hidden');
    questionContainer.innerHTML = '';
    prevBtn.classList.add('hidden');
    nextBtn.classList.add('hidden');
    submitBtn.classList.add('hidden');
    // Render plot in solution if needed
    questions.forEach((q, i) => {
        if (q.plot) {
            setTimeout(() => {
                if (q.plot === "vertical") {
                    const x = [5, 5];
                    const y = [-5, 15];
                    const trace = {
                        x: x,
                        y: y,
                        mode: 'lines',
                        line: {color: '#e83e8c', width: 3}
                    };
                    Plotly.newPlot(`solution-plot-${i}`, [trace], {
                        margin: {t: 10, r: 10, l: 40, b: 40},
                        xaxis: {title: 'x'},
                        yaxis: {title: 'y'},
                        showlegend: false
                    }, {displayModeBar: false});
                } else if (q.plot === "negative") {
                    const x = [];
                    const y = [];
                    for (let j = -5; j <= 5; j++) {
                        x.push(j);
                        y.push(-3 * j - 2);
                    }
                    const trace = {
                        x: x,
                        y: y,
                        mode: 'lines',
                        line: {color: '#dc3545', width: 3}
                    };
                    Plotly.newPlot(`solution-plot-${i}`, [trace], {
                        margin: {t: 10, r: 10, l: 40, b: 40},
                        xaxis: {title: 'x'},
                        yaxis: {title: 'y'},
                        showlegend: false
                    }, {displayModeBar: false});
                } else if (q.plot === "horizontal") {
                    const x = [-5, 5];
                    const y = [7, 7];
                    const trace = {
                        x: x,
                        y: y,
                        mode: 'lines',
                        line: {color: '#28a745', width: 3}
                    };
                    Plotly.newPlot(`solution-plot-${i}`, [trace], {
                        margin: {t: 10, r: 10, l: 40, b: 40},
                        xaxis: {title: 'x'},
                        yaxis: {title: 'y'},
                        showlegend: false
                    }, {displayModeBar: false});
                } else if (q.plot === "positive2") {
                    const x = [];
                    const y = [];
                    for (let j = -5; j <= 5; j++) {
                        x.push(j);
                        y.push(0.5 * j - 4);
                    }
                    const trace = {
                        x: x,
                        y: y,
                        mode: 'lines',
                        line: {color: '#007bff', width: 3, dash: 'dot'}
                    };
                    Plotly.newPlot(`solution-plot-${i}`, [trace], {
                        margin: {t: 10, r: 10, l: 40, b: 40},
                        xaxis: {title: 'x'},
                        yaxis: {title: 'y'},
                        showlegend: false
                    }, {displayModeBar: false});
                } else if (q.plot === "draggable") {
                    // Show initial draggable line
                    let m = 1;
                    let b = 0;
                    const x = [-5, 5];
                    const y = [m * x[0] + b, m * x[1] + b];
                    const trace = {
                        x: x,
                        y: y,
                        mode: 'lines+markers',
                        marker: {size: 10, color: '#ffc107'},
                        line: {color: '#ffc107', width: 3},
                    };
                    const layout = {
                        margin: {t: 10, r: 10, l: 40, b: 40},
                        xaxis: {title: 'x', range: [-6, 6]},
                        yaxis: {title: 'y', range: [-10, 10]},
                        showlegend: false,
                        dragmode: 'drawline',
                        shapes: []
                    };
                    Plotly.newPlot(`solution-plot-${i}`, [trace], layout, {displayModeBar: true, modeBarButtonsToAdd: ['drawline']});
                } else {
                    const x = [];
                    const y = [];
                    for (let j = -5; j <= 5; j++) {
                        x.push(j);
                        y.push(2 * j + 10);
                    }
                    const trace = {
                        x: x,
                        y: y,
                        mode: 'lines',
                        line: {color: '#007bff', width: 3}
                    };
                    Plotly.newPlot(`solution-plot-${i}`, [trace], {
                        margin: {t: 10, r: 10, l: 40, b: 40},
                        xaxis: {title: 'x'},
                        yaxis: {title: 'y'},
                        showlegend: false
                    }, {displayModeBar: false});
                }
            }, 100);
        }
    });
}

// Initial render
renderQuestion();
checkAllAnswered();
