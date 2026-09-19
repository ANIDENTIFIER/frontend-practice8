const form = document.querySelector("#add-form");
const input = document.querySelector("#task-input");
const tip = document.querySelector("#tip");
const list = document.querySelector("#task-list");

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

const filters = document.querySelector('.filters');
let currentFilter = 'all';

const render = () => {
    list.innerHTML = '';
    const shown = tasks.filter(t =>
        currentFilter === 'all' ? true :
        currentFilter === 'active' ? !t.done : t.done
    );
    if (shown.length === 0) {
        const li = document.createElement('li');
        li.textContent = '没有符合条件的任务';
        list.appendChild(li);
        return;
    }
    shown.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;
        if (task.done) li.classList.add('done');
        li.addEventListener('click', () => {
            task.done = !task.done;
            save();
            render();
        });
        list.appendChild(li);
    });
};

const save = () => localStorage.setItem('tasks', JSON.stringify(tasks));

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text === "") {
        tip.textContent = "任务名不能为空";
        return;
    }
    tasks.push({ text: text, done: false });
    tip.textContent = "";
    input.value = "";

    save();
    render();
});

render();

filters.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;
    currentFilter = e.target.dataset.filter;
    render();
});

const state = { data: null };

const loadData = async () => {
    $("#status").text("加载中...").show();
    try {
        const response = await fetch("data/data.json");
        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }
        const data = await response.json();
        if (data.series.length === 0) {
            $("#status").text("暂无数据").show();
            return;
        }
        state.data = data;
        $("#sub-title").text(data.title + " · 数据来源：课程统一数据集");
        $("#status").hide();
        renderCards(data);
        renderBarChart(data);
        renderLineChart(data);
    } catch (error) {
        $("#status")
            .text("加载失败：" + error.message)
            .show();
    }
};

const renderCards = (data) => {
    const months = data.months;
    data.series.forEach((s) => {
        const total = s.counts.reduce((sum, n) => sum + n, 0);
        $("#cards").append(`
        <div class="col-md-4">
            <div class="card">
            <div class="card-body">
                <h3 class="card-title h6">${s.category}</h3>
                <p class="card-text fs-4">${total}</p>
                <p class="card-text small text-muted">共${months.length}个月累计借阅</p>
            </div>
            </div>
        </div>
        `);
    });
};

let barChart = null;

const renderBarChart = (data) => {
    if (barChart === null) {
        barChart = echarts.init(document.querySelector("#bar-chart"));
    }
    barChart.setOption({
        title: { text: "各月各品类借阅量", left: "center" },
        tooltip: { trigger: "axis" },
        legend: { bottom: 0 },
        xAxis: { data: data.months },
        yAxis: { name: "册" },
        series: data.series.map((s) => ({
            name: s.category,
            type: "bar",
            data: s.counts,
        })),
    });
};

let lineChart = null;

const renderLineChart = (data) => {
    if (lineChart !== null) {
        lineChart.destroy();
    }
    const ctx = document.querySelector("#line-chart");
    lineChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: data.months,
            datasets: data.series.map((s) => ({
                label: s.category,
                data: s.counts,
                borderWidth: 1,
            })),
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: "借阅趋势（单位：册）" },
            },
        },
    });

    barChart.on("click", p => {
        const target = p.seriesName;
        lineChart.data.datasets.forEach(dataset => {
            if (dataset.label === target) {
                dataset.borderWidth = 6;
            } else {
                dataset.borderWidth = 1;
            }
        });
        lineChart.update();
    });
};

loadData();

window.addEventListener("resize", () => {
    if (barChart) barChart.resize();
});

$('#cards').on('click', '.card', function () {
    $(this).toggleClass('border-primary shadow');
});
