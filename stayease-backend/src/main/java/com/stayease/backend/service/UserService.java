package com.stayease.backend.service;

import com.stayease.backend.dto.RegisterRequest;
import com.stayease.backend.model.User;

public interface UserService {
    User register(RegisterRequest dto);
}
