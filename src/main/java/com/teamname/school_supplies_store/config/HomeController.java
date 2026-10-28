package com.teamname.school_supplies_store.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class HomeController {

    @GetMapping("/")
    public RedirectView home() {
        return new RedirectView("http://localhost:5173/");
    }
}
