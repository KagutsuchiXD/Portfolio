package com.OsborneStewartPokemonSnapIRLProject2.phoneapp;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.lifecycle.ViewModelProvider;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;

import com.OsborneStewartPokemonSnapIRLProject2.api.viewmodels.UserViewModel;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.navigation.NavigationView;

public class MainActivity extends AppCompatActivity {
    public UserViewModel viewModel;
    public int userPic = R.mipmap.ic_usermark_foreground;
    public String closePokeInfo = "No Pokemon close by.";
    Bundle myBundle;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        viewModel = new ViewModelProvider(this).get(UserViewModel.class);
        setContentView(R.layout.activity_main);

        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction()
                    .add(R.id.fragment_container, HomeFragment.class, myBundle)
                    .setReorderingAllowed(true)
                    .commit();
        }

        MaterialToolbar toolbar = findViewById(R.id.topAppBar);
        DrawerLayout drawer = findViewById(R.id.drawer_layout);
        toolbar.setNavigationOnClickListener(view -> {
            drawer.open();
        });

        NavigationView navigationView = findViewById(R.id.navigation_view);
        navigationView.setNavigationItemSelectedListener(menuItem -> {
            menuItem.setChecked(true);
            if (menuItem.getItemId() == R.id.home_item) {
                getSupportFragmentManager().beginTransaction()
                        .replace(R.id.fragment_container, HomeFragment.class, myBundle)
                        .setReorderingAllowed(true)
                        .commit();
            }
            if (menuItem.getItemId() == R.id.profile_item) {
                getSupportFragmentManager().beginTransaction()
                        .replace(R.id.fragment_container, ProfileFragment.class, myBundle)
                        .setReorderingAllowed(true)
                        .commit();
            }
//            if (menuItem.getItemId() == R.id.pictures_item) {
//                getSupportFragmentManager().beginTransaction()
//                        .replace(R.id.fragment_container, PicturesFragment.class, null)
//                        .setReorderingAllowed(true)
//                        .commit();
//            }
            if (menuItem.getItemId() == R.id.settings_item) {
                getSupportFragmentManager().beginTransaction()
                        .replace(R.id.fragment_container, SettingsFragment.class, myBundle)
                        .setReorderingAllowed(true)
                        .commit();
            }
            if (menuItem.getItemId() == R.id.logout_item) {
                viewModel.signOut();
            }
            drawer.close();
            return true;
        });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @Override
    protected void onStart() {
        super.onStart();
        viewModel.getUser().observe(this, (user) -> {
            if (user == null) {
                Intent intent = new Intent(this, SignInSignUpActivity.class);
                startActivity(intent);
                finish();
            }
        });
    }

    public void setUserPic(int userPic) {
        this.userPic = userPic;
    }

    public int getUserPic(){
        return this.userPic;
    }
}