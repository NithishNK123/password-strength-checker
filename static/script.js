const checkBtn = document.getElementById('checkBtn');
const passwordInput = document.getElementById('passwordInput');
const scoreDisplay = document.getElementById('scoreDisplay');
const statusBadge = document.getElementById('statusBadge');
const suggestionsCard = document.getElementById('suggestionsCard');
const feedbackList = document.getElementById('feedbackList');

// Global reference variable to store our chart instance lifecycle state
let strengthChartInstance = null;

checkBtn.addEventListener('click', async () => {
    const passwordValue = passwordInput.value;

    if (passwordValue.trim() === "") {
        alert("⚠️ Please enter a password before clicking check!");
        return;
    }

    try {
        const response = await fetch('/check-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passwordValue })
        });

        const data = await response.json();

        // 1. Update and reveal the Point Value text box
        scoreDisplay.innerText = `Your password score: ${data.score} out of 5`;
        scoreDisplay.style.display = 'block';

        // 2. Generate and update our custom Pie Chart
        const chartContainer = document.getElementById('chartContainer');
        chartContainer.style.display = 'block';

        const passedRules = data.score;
        const failedRules = 5 - data.score;

        if (strengthChartInstance) {
            strengthChartInstance.destroy();
        }

        const ctx = document.getElementById('strengthChart').getContext('2d');
        strengthChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Criteria Passed', 'Criteria Missing'],
                datasets: [{
                    data: [passedRules, failedRules],
                    backgroundColor: ['#38a169', '#e53e3e'], 
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });

        // 3. Reset style states and update the Risk Alert Level badge
        statusBadge.className = "status-badge"; 
        statusBadge.innerText = `Risk Assessment: ${data.strength}`;
        
        if (data.strength === "Strong") {
            statusBadge.classList.add("bg-strong");
        } else if (data.strength === "Medium") {
            statusBadge.classList.add("bg-medium");
        } else {
            statusBadge.classList.add("bg-weak");
        }
        statusBadge.style.display = 'block';

        // 4. Reset and populate the Suggestions List card block
        feedbackList.innerHTML = ""; 
        if (data.feedback.length > 0) {
            data.feedback.forEach(issue => {
                const li = document.createElement('li');
                li.innerText = `Missing: ${issue}`;
                feedbackList.appendChild(li);
            });
            suggestionsCard.style.display = 'block';
        } else {
            suggestionsCard.style.display = 'none';
        }

    } catch (error) {
        console.error("Communication trace error:", error);
        alert("Error connecting to the analytical database engine.");
    }
});
