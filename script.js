function DigitalClock()
{
    const DigitalClockNumbers = (number) => (number < 10 ? "0" + number : number);

    const today = new Date();

    const date = DigitalClockNumbers(today.getDate());
    const month = DigitalClockNumbers(today.getMonth() + 1);
    const year = today.getFullYear();

    const hours = DigitalClockNumbers(today.getHours());
    const minutes = DigitalClockNumbers(today.getMinutes());
    const seconds = DigitalClockNumbers(today.getSeconds());

    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = weekday[today.getDay()];

    document.querySelector(".Hour").textContent = `${hours}:${minutes}:${seconds}`;

    document.querySelector(".Date").textContent = `${date}.${month}.${year}`;

    document.querySelector(".Day").textContent = `${day}`;
}
setInterval(DigitalClock, 1000);

function AnalogyClock()
{
    const now = new Date;

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourDegree = 30 * hours + minutes / 2;
    const minuteDegree = 6 * minutes;
    const secondDegree = 6 * seconds;

    document.querySelector(".HourClockHand").style.transform = `rotateZ(${hourDegree}deg)`;
    document.querySelector(".MinuteClockHand").style.transform = `rotateZ(${minuteDegree}deg)`;
    document.querySelector(".SecondClockHand").style.transform = `rotateZ(${secondDegree}deg)`;
}
setInterval(AnalogyClock, 1000);

const skyColors =
{
    dawn:[[24,30,46], [35,70,92], [50,111,132], [117,164,170], [194,195,181], [251,226,169], [253,203,142], [255,160,50]],
    morning:[[115,138,169], [128,151,182], [142,164,185], [158,174,189], [182,192,193], [211,213,202], [230,224,198], [251,226,169]],
    noon:[[2,47,88], [0,52,92], [0,62,106], [0,79,135], [0,102,164], [0,114,177], [12,145,202], [133,187,213]],
    afternoon:[[92,126,172], [103,135,176], [126,159,190], [154,185,203], [165,187,200], [174,188,188], [177,188,184], [195,197,183]],
    twilight:[[24,30,46], [35,70,92], [50,111,132], [117,164,170], [194,195,181], [251,226,169], [253,203,142], [255,160,50]],
    night:[[31,29,40], [40,38,52], [49,47,61], [58,56,70], [65,63,77], [84,77,93], [85,83,97], [97,90,106]]
}

function interpolateValue(start, end, transition_factor)
{
    return start + (end - start) * transition_factor;
}

function ChangeBackground()
{
    const now = new Date();
    const hours = now.getHours();
    const totalMinutes = now.getHours() * 60 + now.getMinutes();

    let startColors, endColors, transition_factor;

    if (hours >= 6 && hours < 9)
    {
        startColors = skyColors.dawn;
        endColors = skyColors.morning;
        transition_factor = (totalMinutes - 360) / 180;
    }
    else if (hours >= 9 && hours < 12)
    {
        startColors = skyColors.morning;
        endColors = skyColors.noon;
        transition_factor = (totalMinutes - 540) / 180;
    }
    else if (hours >= 12 && hours < 14)
    {
        startColors = skyColors.noon;
        endColors = skyColors.afternoon;
        transition_factor = (totalMinutes - 720) / 120;
    }
    else if (hours >= 14 && hours < 17)
    {
        startColors = skyColors.afternoon;
        endColors = skyColors.twilight;
        transition_factor = (totalMinutes - 840) / 180;
    }
    else if (hours >= 17 && hours < 20)
    {
        startColors = skyColors.twilight;
        endColors = skyColors.night;
        transition_factor = (totalMinutes - 1020) / 180;
    }
    else if (hours >= 20 || hours < 4)
    {
        startColors = skyColors.night;
        endColors = skyColors.night;
        transition_factor = 0;
    }
    else
    {
        startColors = skyColors.night;
        endColors = skyColors.dawn;
        transition_factor = (totalMinutes - 240) / 120;
    }

    const colors = startColors.map((startColor, i) =>
    {
        const endColor = endColors[i];
        return startColor.map((c, j) => Math.round(interpolateValue(c, endColor[j], transition_factor)));
    });

    let gradientAngle;

    if (hours >= 4 && hours < 6)
    {
        gradientAngle = interpolateValue(540, 555, (hours - 4) / 2);
    }
    else if (hours >= 6 && hours < 9)
    {
        gradientAngle = interpolateValue(555, 540, (hours - 6) / 3);
    }
    else if (hours >= 17 && hours < 20)
    {
        gradientAngle = interpolateValue(540, 525, (hours - 17) / 3);
    }
    else
    {
        gradientAngle = 540;
    }
    return `linear-gradient(${gradientAngle}deg, ${colors.map(color => `rgb(${color.join(",")})`).join(", ")})`;
}

function updateBackground()
{
    document.body.style.background = ChangeBackground();
}
setInterval(updateBackground, 1000);

function updateSunPosition()
{
    const now = new Date();
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    const sun = document.querySelector(".Sun");
    const sunlight = document.querySelector(".Sunlight");

    const startX = -20;
    const startY = 20;
    const midX = 45;
    const midY = 0;
    const endX = 110;
    const endY = 20;

    const dayStart = 6 * 60;
    const dayEnd = 18 * 60;

    let dayProgress = (totalMinutes - dayStart) / (dayEnd - dayStart);
    dayProgress = Math.max(0, Math.min(1, dayProgress));

    let sunX, sunY;

    if (dayProgress < 0.5)
    {
        let firstHalf = dayProgress * 2;
        sunX = startX + (midX - startX) * firstHalf;
        sunY = startY + (midY - startY) * firstHalf;
    }
    else
    {
        let secondHalf = (dayProgress - 0.5) * 2;
        sunX = midX + (endX - midX) * secondHalf;
        sunY = midY + (endY - midY) * secondHalf;
    }

    sun.style.left = `${sunX}vw`;
    sun.style.top = `${sunY}vh`;

    sunlight.style.left = `${sunX}vw`;
    sunlight.style.top = `${sunY}vh`;
}
setInterval(updateSunPosition, 1000);

function updateMoonPosition()
{
    const now = new Date();
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    const moon = document.querySelector(".Moon");
    const moonlight = document.querySelector(".Moonlight");

    const startX = -20;
    const startY = 20;
    const midX = 45;
    const midY = 0;
    const endX = 110;
    const endY = 20;

    const nightStart = 18 * 60;
    const nightEnd = 30 * 60;

    let nightProgress;
    let moonX, moonY;

    if (now.getHours() >= 0 && now.getHours() < 6)
    {
        nightProgress = ((totalMinutes + 1440) - nightStart) / (nightEnd - nightStart);
    }
    else
    {
        nightProgress = (totalMinutes - nightStart) / (nightEnd - nightStart);
    }
    nightProgress = Math.max(0, Math.min(1, nightProgress));

    if (nightProgress < 0.5)
    {
        let firstHalf = nightProgress * 2;
        moonX = startX + (midX - startX) * firstHalf;
        moonY = startY + (midY - startY) * firstHalf;
    }
    else
    {
        let secondHalf = (nightProgress - 0.5) * 2;
        moonX = midX + (endX - midX) * secondHalf;
        moonY = midY + (endY - midY) * secondHalf;
    }

    moon.style.left = `${moonX}vw`;
    moon.style.top = `${moonY}vh`;

    moonlight.style.left = `${moonX}vw`;
    moonlight.style.top = `${moonY}vh`;
}
setInterval(updateMoonPosition, 1000);

function updateStarsOpacity()
{
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const stars = document.querySelector(".Stars");
    const starlight = document.querySelector(".Starlight");

    const ShowStars = hours >= 18 || hours < 7;

    if (ShowStars)
    {
        stars.style.dosplay = "block";
        starlight.style.display = "block";

        let opacity = 0.8;

        if (hours >= 18 && hours < 19)
        {
            opacity = 0.1 + ((minutes / 60) * 0.7);
        }
        else if (hours >= 6 && hours < 7)
        {
            opacity = 0.8 - ((minutes / 60) * 0.8);
        }
        opacity = Math.min(0.8, Math.max(0, opacity));
        stars.style.opacity = opacity;
        starlight.style.opacity = opacity;
    }
    else
    {
        stars.style.display = "none";
        starlight.style.display = "none";
    }
}
setInterval(updateStarsOpacity, 1000);

function initAllFunctions()
{
    DigitalClock();
    AnalogyClock();
    updateBackground();
    updateSunPosition();
    updateMoonPosition();
    updateStarsOpacity();
}