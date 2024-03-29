// Thời gian bắt đầu và kết thúc làm việc (8h đến 17h)
const startHour = 8;
const endHour = 17;

// Số lượng bản ghi cho mỗi người dùng và mỗi dự án
const numRecordsPerUserProject = 12;

// Danh sách user và project
const users = [1, 2];
const projects = [53, 54];

// Hàm tạo timestamp từ giờ và phút
function createTimestamp(hour, minute) {
    return hour * 3600 * 1000 + minute * 60 * 1000;
}

// Danh sách lưu trữ bản ghi
const records = [];

// Hàm tạo bản ghi
function createRecord(userId, projectId) {
    for (let i = 0; i < numRecordsPerUserProject; i++) {
        // Tạo timestamp ngẫu nhiên trong khoảng thời gian làm việc
        const startHourRandom = startHour + Math.floor(Math.random() * 8);
        const startMinuteRandom = Math.floor(Math.random() * 60);
        const startTimestamp = createTimestamp(startHourRandom, startMinuteRandom);

        const endHourRandom = startHourRandom + 8; // 8 giờ làm việc
        const endMinuteRandom = Math.floor(Math.random() * 60);
        const endTimestamp = createTimestamp(endHourRandom, endMinuteRandom);

        // Tạo bản ghi mới
        const record = {
            userId: userId,
            startTime: startTimestamp,
            endTime: endTimestamp,
            projectId: projectId,
            status: "Approved",
            taskType: "officeHour",
            deleteFlg: "0",
            createdAt: startTimestamp,
            createdBy: userId,
            updatedAt: endTimestamp,
            updatedBy: userId
        };

        // Thêm bản ghi vào danh sách
        records.push(record);
    }
}

// Lặp qua mỗi user và mỗi dự án
users.forEach(user => {
    projects.forEach(project => {
        createRecord(user, project);
    });
});

console.log(records);
