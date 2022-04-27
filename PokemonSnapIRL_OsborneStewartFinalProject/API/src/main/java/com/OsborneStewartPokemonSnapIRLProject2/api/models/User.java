package com.OsborneStewartPokemonSnapIRLProject2.api.models;

import com.google.firebase.auth.FirebaseUser;

public class User {
    String uid;
    public String email;
    public String username;
    public String profile;
    public long score;

    public User(FirebaseUser user) {
        this.uid = user.getUid();
        this.email = user.getEmail();
        this.username = user.getDisplayName();
        this.profile = "Ash";
        this.score = 0;
    }
}
