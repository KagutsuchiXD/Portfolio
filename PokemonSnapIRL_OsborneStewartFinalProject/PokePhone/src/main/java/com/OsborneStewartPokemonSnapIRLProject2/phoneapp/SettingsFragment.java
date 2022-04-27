package com.OsborneStewartPokemonSnapIRLProject2.phoneapp;

import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RadioButton;
import android.widget.RadioGroup;

public class SettingsFragment extends Fragment {

    RadioGroup radioGroup;
    RadioButton radioButton;
    String currentProf;

    public SettingsFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        radioGroup = requireActivity().findViewById(R.id.radioGroup);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_settings, container, false);
        radioGroup = (RadioGroup) view.findViewById(R.id.radioGroup);
        if (radioGroup == null){
            System.out.println("No Radio Group Found");
        }
        else{
            radioGroup.setOnCheckedChangeListener((group, checkedId) -> {
                int radioID = radioGroup.getCheckedRadioButtonId();

                radioButton = requireActivity().findViewById(radioID);
                String text = (String) radioButton.getText();
                switch (text){
                    case "Ash":
                        System.out.println("Changed profile pic to Ash");
                        ((MainActivity)requireActivity()).setUserPic(R.mipmap.ic_usermark_foreground);
                        ((MainActivity)requireActivity()).viewModel.setUserProfile("Ash");
                        break;
                    case "Green":
                        System.out.println("Changed profile pic to Green");
                        ((MainActivity)requireActivity()).setUserPic(R.mipmap.ic_usermarkgreen_foreground);
                        ((MainActivity)requireActivity()).viewModel.setUserProfile("Green");
                        break;
                    case "Harrison":
                        System.out.println("Changed profile pic to Harrison");
                        ((MainActivity)requireActivity()).setUserPic(R.mipmap.ic_usermarkharrison_foreground);
                        ((MainActivity)requireActivity()).viewModel.setUserProfile("Harrison");
                        break;
                    case "May":
                        System.out.println("Changed profile pic to May");
                        ((MainActivity)requireActivity()).setUserPic(R.mipmap.ic_usermarkmay_foreground);
                        ((MainActivity)requireActivity()).viewModel.setUserProfile("May");
                        break;
                    case "X":
                        System.out.println("Changed profile pic to X");
                        ((MainActivity)requireActivity()).setUserPic(R.mipmap.ic_usermarkx_foreground);
                        ((MainActivity)requireActivity()).viewModel.setUserProfile("X");
                        break;
                    case "Serena":
                        System.out.println("Changed profile pic to Serena");
                        ((MainActivity)requireActivity()).setUserPic(R.mipmap.ic_usermarkserena_foreground);
                        ((MainActivity)requireActivity()).viewModel.setUserProfile("Serena");
                        break;
                }
            });
        }


        return view;
    }

}