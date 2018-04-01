const intervals = {
    minute: "m",
    hour: "h",
    day: "D",
    week: "W",
    month: "M",
    year: "Y",
};

function normalizeGroupTimeInterval(time) {
    if (!time) return intervals.hour;
    let times = Object.keys(intervals).map(key => intervals[key]);
    if (!times.includes(time)) {
        throw new Error(`groupTimeInterval must be on of [${times.join(", ")}]`);
    }
    return time;
}

function getGroupTime(group, {naturalTime = new Date(), groupOffset = 0} = {}) {
    let groupTime = new Date(naturalTime);

    switch (group) {
        case intervals.minute:
            groupTime.setUTCHours(groupTime.getUTCHours(), groupTime.getUTCMinutes() + groupOffset, 0, 0);
            break;
        case intervals.hour:
            groupTime.setUTCHours(groupTime.getUTCHours() + groupOffset, 0, 0, 0);
            break;
        case intervals.day:
            groupTime.setUTCHours(0, 0, 0, 0);
            groupTime.setUTCDate(groupTime.getUTCDate() + groupOffset);
            break;
        case intervals.week:
            let day = (6 + groupTime.getUTCDay()) % 7; //starts on monday
            groupTime.setUTCHours(0, 0, 0, 0);
            groupTime.setUTCDate(groupTime.getUTCDate() - day + (groupOffset * 7));
            break;
        case intervals.month:
            groupTime.setUTCHours(0, 0, 0, 0);
            groupTime.setUTCMonth(groupTime.getUTCMonth() + groupOffset, 1);
            break;
        case intervals.year:
            groupTime.setUTCHours(0, 0, 0, 0);
            groupTime.setUTCFullYear(groupTime.getUTCFullYear() + groupOffset, 0, 1);
            break;
    }

    return groupTime;
}

module.exports = {
    normalizeGroupTimeInterval,
    getGroupTime,
};