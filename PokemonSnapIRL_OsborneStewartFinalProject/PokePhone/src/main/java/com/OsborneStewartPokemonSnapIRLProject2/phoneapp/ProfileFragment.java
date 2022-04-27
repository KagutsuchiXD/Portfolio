package com.OsborneStewartPokemonSnapIRLProject2.phoneapp;

import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.fragment.app.Fragment;

public class ProfileFragment extends Fragment {

    public ProfileFragment() {
        super(R.layout.fragment_profile);
    }

    @Override
    public void onStart() {
        super.onStart();
        View view = getView();


        TextView textthing = view.findViewById(R.id.usernameText);
        textthing.setText(((MainActivity)requireActivity()).viewModel.getUsername());

        ImageView profImage = view.findViewById(R.id.profileImage);
        String imageName = ((MainActivity)requireActivity()).viewModel.getUser().getValue().profile;
        switch (imageName){
            case "Ash":
                profImage.setImageResource(R.drawable.ash);
                break;
            case "Green":
                profImage.setImageResource(R.drawable.green);
                break;
            case "Harrison":
                profImage.setImageResource(R.drawable.harrison);
                break;
            case "May":
                profImage.setImageResource(R.drawable.may);
                break;
            case "X":
                profImage.setImageResource(R.drawable.x);
                break;
            case "Serena":
                profImage.setImageResource(R.drawable.serena);
                break;
        }

        TextView score = view.findViewById(R.id.score);
        long currentScore = ((MainActivity)requireActivity()).viewModel.getUser().getValue().score;

        score.setText(String.valueOf(currentScore));
    }
}