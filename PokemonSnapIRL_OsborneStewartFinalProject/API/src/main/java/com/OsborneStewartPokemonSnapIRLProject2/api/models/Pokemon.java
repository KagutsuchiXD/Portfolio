package com.OsborneStewartPokemonSnapIRLProject2.api.models;

import androidx.annotation.Nullable;

import com.google.firebase.database.Exclude;

import java.util.Random;

public class Pokemon {

    public String species;
    public double lat;
    public double lon;

    @Exclude
    public String id;

    public Pokemon(){}

    public Pokemon(double lat, double lon){
        Random rand = new Random();
        int specNumber = rand.nextInt(16);
        switch(specNumber){
            case 0:
                this.species = "pikachu";
                break;
            case 1:
                this.species = "bulbasaur";
                break;
            case 2:
                this.species = "squirtle";
                break;
            case 3:
                this.species = "charmander";
                break;
            case 4:
                this.species = "caterpie";
                break;
            case 5:
                this.species = "weedle";
                break;
            case 6:
                this.species = "pidgey";
                break;
            case 7:
                this.species = "rattata";
                break;
            case 8:
                this.species = "spearow";
                break;
            case 9:
                this.species = "ekans";
                break;
            case 10:
                this.species = "sandshrew";
                break;
            case 11:
                this.species = "nidorang";
                break;
            case 12:
                this.species = "nidoranb";
                break;
            case 13:
                this.species = "clefairy";
                break;
            case 14:
                this.species = "vulpix";
                break;
            case 15:
                this.species = "jigglypuff";
                break;
        }
        this.lat = lat;
        this.lon = lon;
    }

    @Override
    public boolean equals(@Nullable Object obj) {
        if (obj instanceof Pokemon) {
            Pokemon other = (Pokemon) obj;
            return other.id.equals(id);
        }
        return false;
    }
}
