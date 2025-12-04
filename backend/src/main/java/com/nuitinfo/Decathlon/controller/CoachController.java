package com.nuitinfo.Decathlon.controller;

import org.springframework.web.bind.annotation.GetMapping;

public class CoachController {
    @GetMapping("/test")
    public String test() {
        return "Le Backend répond !";
    }
}
