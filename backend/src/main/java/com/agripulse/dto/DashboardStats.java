package com.agripulse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class DashboardStats {
    private long totalUsers;
    private long activeUsers;
    private long inactiveUsers;
    private long usersNotResetPassword;
    private long todayRegistrations;
    private List<WeeklyData> weeklyGrowth;
    private Map<String, Long> userCategories;
    
    @Data
    @AllArgsConstructor
    public static class WeeklyData {
        private String day;
        private long count;
    }
}
