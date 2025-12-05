package com.nuitinfo.Decathlon.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeaderboardEntry {
    private String pseudo;
    private int point;
    private String level;
    private String badge;
}