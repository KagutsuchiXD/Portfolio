package com.OsborneStewartPokemonSnapIRLProject2.api.viewmodels;

import androidx.databinding.ObservableArrayList;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.OsborneStewartPokemonSnapIRLProject2.api.models.Pokemon;

import java.util.concurrent.ThreadLocalRandom;

public class PokemonPointsListModel extends ViewModel {
    ObservableArrayList<Pokemon> pokemonList;
    Pokemon closePoke;
    private double maxLatitude;
    private double maxLongitude;
    private double minLatitude;
    private double minLongitude;

    public PokemonPointsListModel(){};

    public ObservableArrayList<Pokemon> getPokemonList(){
        if (pokemonList == null){
            pokemonList = new ObservableArrayList<Pokemon>();
            generatePokemonList();
        }
        return pokemonList;
    }

    private void generatePokemonList(){
        for(int i = 0; i < 300; i++){
            double nextLat = ThreadLocalRandom.current().nextDouble(minLatitude , maxLatitude);
            double nextLon = ThreadLocalRandom.current().nextDouble(minLongitude , maxLongitude);
            Pokemon newPoke = new Pokemon(nextLat, nextLon);
            pokemonList.add(newPoke);
        }
    }

    public void setGrid(double maxlat, double minlat, double maxlon, double minlon){
        maxLatitude = maxlat;
        minLatitude = minlat;
        maxLongitude = maxlon;
        minLongitude = minlon;
    }

    public void setClosePoke(Pokemon poke){
        closePoke = poke;
    }

    public Pokemon getClosePoke(){
        return closePoke;
    }

}
