private void writeDataLines() {
    Map<String, Map<Integer, Long>> totalWorkTime = new HashMap<>();
    Map<String, Map<Integer, Long>> totalWorkTimeAllProjects = new HashMap<>();
    
    // Calculate total work time per project per user and total work time across all projects per user per month
    for (Timeline timeline : listTimelines) {
        long userId = timeline.getId();
        long projectId = timeline.getProjectId();
        long startTime = timeline.getStartTime().getTime();
        long endTime = timeline.getEndTime().getTime();
        long workTime = endTime - startTime;
        int month = getMonth(startTime);
        String key = "Project " + projectId + ", User " + userId;
        
        // Update total work time per project per user
        totalWorkTime.putIfAbsent(key, new HashMap<>());
        totalWorkTime.get(key).merge(month, workTime, Long::sum);
        
        // Update total work time across all projects per user per month
        String userKey = "User " + userId;
        totalWorkTimeAllProjects.putIfAbsent(userKey, new HashMap<>());
        totalWorkTimeAllProjects.get(userKey).merge(month, workTime, Long::sum);
    }
    
    // Write data to Excel
    int rowNum = 1;
    for (Map.Entry<String, Map<Integer, Long>> entry : totalWorkTime.entrySet()) {
        Row row = sheet.createRow(rowNum++);
        String projectUserKey = entry.getKey();
        String[] keyParts = projectUserKey.split(", ");
        
        // Extract project and user IDs
        String project = keyParts[0].substring(8);
        String user = keyParts[1].substring(5);
        
        // Write project and user IDs to Excel
        row.createCell(0).setCellValue(project);
        row.createCell(1).setCellValue(user);
        
        Map<Integer, Long> monthlyWorkTime = entry.getValue();
        Map<Integer, Long> totalWorkTimeForUser = totalWorkTimeAllProjects.get("User " + user);
        
        // Write monthly work time and calculate percentage
        for (int i = 1; i <= 12; i++) {
            long projectWorkTime = monthlyWorkTime.getOrDefault(i, 0L);
            long totalWorkTime = totalWorkTimeForUser.getOrDefault(i, 1L); // Prevent division by zero
            double percentage = (double) projectWorkTime / totalWorkTime * 100;
            Cell cell = row.createCell(i + 1);
            cell.setCellValue(percentage);
            CellStyle style = workbook.createCellStyle();
            style.setDataFormat(workbook.createDataFormat().getFormat("0.00%")); // Format cell as percentage
            cell.setCellStyle(style);
        }
    }
}
