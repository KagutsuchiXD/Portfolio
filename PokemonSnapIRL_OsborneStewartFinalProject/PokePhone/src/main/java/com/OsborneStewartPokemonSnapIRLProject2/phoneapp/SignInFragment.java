package com.OsborneStewartPokemonSnapIRLProject2.phoneapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.OsborneStewartPokemonSnapIRLProject2.api.viewmodels.UserViewModel;
import com.google.android.material.textfield.TextInputLayout;

public class SignInFragment extends Fragment {
    protected UserViewModel viewModel;

    public SignInFragment() {
        super(R.layout.fragment_sign_in);
    }

    @Override
    public void onStart() {
        super.onStart();
        viewModel = new ViewModelProvider(this).get(UserViewModel.class);
        View view = getView();
        TextInputLayout emailTextField = view.findViewById(R.id.emailTextField);
        TextInputLayout passwordTextField = view.findViewById(R.id.passwordTextField);
        Button signInButton = view.findViewById(R.id.signInButton);
        Button signUpButton = view.findViewById(R.id.signUpButton);

        signInButton.setOnClickListener((View) -> {
            viewModel.signIn(emailTextField.getEditText().getText().toString(), passwordTextField.getEditText().getText().toString());
        });

        signUpButton.setOnClickListener((view1) -> {
            getActivity().getSupportFragmentManager().beginTransaction()
                    .replace(R.id.SignInFragContainer, SignUpFragment.class, null)
                    .setReorderingAllowed(true)
                    .addToBackStack(null)
                    .commit();
        });
    }
}