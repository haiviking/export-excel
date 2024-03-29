const XlsxPopulate = require('xlsx-populate');

function writeDataLines(listTimelines) {
    const totalWorkTime = {};
    const totalWorkTimeAllProjects = {};

    // Calculate total work time per project per user and total work time across all projects per user per month
    listTimelines.forEach(timeline => {
        const userId = timeline.id;
        const projectId = timeline.projectId;
        const startTime = new Date(timeline.startTime).getTime();
        const endTime = new Date(timeline.endTime).getTime();
        const workTime = endTime - startTime;
        const month = getMonth(startTime);
        const key = `Project ${projectId}, User ${userId}`;

        // Update total work time per project per user
        totalWorkTime[key] = totalWorkTime[key] || {};
        totalWorkTime[key][month] = (totalWorkTime[key][month] || 0) + workTime;

        // Update total work time across all projects per user per month
        totalWorkTimeAllProjects[`User ${userId}`] = totalWorkTimeAllProjects[`User ${userId}`] || {};
        totalWorkTimeAllProjects[`User ${userId}`][month] = (totalWorkTimeAllProjects[`User ${userId}`][month] || 0) + workTime;
    });

    // Create a new workbook
    return XlsxPopulate.fromBlankAsync()
        .then(workbook => {
            const sheet = workbook.addSheet('2024年(can doi)');

            // Write header row
            sheet.cell('A1').value('Project');
            sheet.cell('B1').value('User');
            for (let i = 1; i <= 12; i++) {
                sheet.cell(1, i + 1).value(i);
            }

            let rowNum = 2;
            // Write data to sheet
            Object.entries(totalWorkTime).forEach(([key, monthlyWorkTime]) => {
                const [project, user] = key.split(', ');

                // Write project and user IDs
                sheet.cell(rowNum, 1).value(project.substring(8)); // Project
                sheet.cell(rowNum, 2).value(user.substring(5)); // User

                Object.entries(monthlyWorkTime).forEach(([month, projectWorkTime]) => {
                    const totalWorkTimeForUser = totalWorkTimeAllProjects[`User ${user}`][month];
                    const percentage = projectWorkTime / totalWorkTimeForUser * 100 || 0; // Prevent division by zero

                    // Write percentage
                    sheet.cell(rowNum, parseInt(month) + 1).value(percentage).style('numberFormat', '0.0');
                });

                rowNum++;
            });

            return workbook.outputAsync();
        });
}

function getMonth(timestamp) {
    const dateTime = new Date(timestamp);
    return dateTime.getMonth() + 1; // Months are zero-indexed in JavaScript Date objects
}

// Example usage
const listTimelines = [
    { id: 1, projectId: 1, startTime: '2024-01-01T00:00:00', endTime: '2024-01-01T01:00:00' },
    { id: 1, projectId: 1, startTime: '2024-01-01T01:00:00', endTime: '2024-01-01T02:00:00' },
    { id: 1, projectId: 2, startTime: '2024-01-01T02:00:00', endTime: '2024-01-01T03:00:00' },
    // Add more timeline data as needed
];

writeDataLines(listTimelines)
    .then(data => {
        // Write data to file or do further processing
        console.log("Excel data:", data);
    })
    .catch(error => {
        console.error("Error:", error);
    });
