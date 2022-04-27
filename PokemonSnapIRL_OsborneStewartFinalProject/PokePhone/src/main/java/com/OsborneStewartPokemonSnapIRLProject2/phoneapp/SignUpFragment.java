package com.OsborneStewartPokemonSnapIRLProject2.phoneapp;

import android.view.View;
import android.widget.Button;

import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.OsborneStewartPokemonSnapIRLProject2.api.viewmodels.UserViewModel;
import com.google.android.material.textfield.TextInputLayout;

public class SignUpFragment extends Fragment {
    protected UserViewModel viewModel;

    public SignUpFragment() {
        super(R.layout.fragment_sign_up);
    }

    @Override
    public void onStart() {
        super.onStart();

        viewModel = new ViewModelProvider(this).get(UserViewModel.class);
        View view = getView();

        TextInputLayout email = view.findViewById(R.id.emailSignUpField);
        TextInputLayout username = view.findViewById(R.id.usernameSignUpField);
        TextInputLayout password = view.findViewById(R.id.passwordSignUpField);
        Button createButton = view.findViewById(R.id.createButton);

        createButton.setOnClickListener((view1 -> {
            viewModel.signUp(
                    email.getEditText().getText().toString(),
                    username.getEditText().getText().toString(),
                    password.getEditText().getText().toString()
            );
        }));
    }
}