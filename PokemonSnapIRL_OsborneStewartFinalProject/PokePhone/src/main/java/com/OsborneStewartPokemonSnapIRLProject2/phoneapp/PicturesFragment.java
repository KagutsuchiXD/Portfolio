package com.OsborneStewartPokemonSnapIRLProject2.phoneapp;

import android.view.View;
import android.widget.GridView;
import android.widget.TextView;

import androidx.fragment.app.Fragment;

//import com.OsborneStewartPokemonSnapIRLProject2.api.ImageAdapter;

public class PicturesFragment extends Fragment {
    private static final int SHORT_DELAY = 2000;
    View view;
    TextView pictureText;
    GridView gridView;

    public PicturesFragment() {
        super(R.layout.fragment_pictures);
    }

    @Override
    public void onStart() {
        super.onStart();
        view = getView();
        pictureText = view.findViewById(R.id.picturesText);
        gridView = view.findViewById(R.id.pictureGrid);
        //gridView.setAdapter(new ImageAdapter(getContext()));
        pictureText.setText("");
    }
}