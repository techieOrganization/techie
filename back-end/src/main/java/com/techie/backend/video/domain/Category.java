package com.techie.backend.video.domain;

import lombok.Getter;

@Getter
public enum Category {
    LANG("PLnXuZ8uq_pEzukhPLqUyCvTttrGLHYdX-"),
    GAME("PLnXuZ8uq_pEy3iNLMBzuTZiaOdag3jD2j"),
    BACK("PLnXuZ8uq_pEwpUqyIHT2nadcahS9140iN"),
    MOBILE("PLnXuZ8uq_pExCp6JiZR86JBgO1MQOHd1s"),
    FRONT("PLnXuZ8uq_pEwA3zIEs8VrMZnuDwPbiVV4"), // 수정
    DATA("PLnXuZ8uq_pEw-n-gp3N-wbgczXLGOGLKM"),
    AI("PLnXuZ8uq_pEwA3zIEs8VrMZnuDwPbiVV4"), //수정
    SEC("PLnXuZ8uq_pEyLc2Gpe2MEhUopshbNbqvS"),
    CS("PLnXuZ8uq_pEwA3zIEs8VrMZnuDwPbiVV4"), //수정
    CLOUD("PLnXuZ8uq_pEwA3zIEs8VrMZnuDwPbiVV4");

    private final String playlistId;

    Category(String playlistId) {
        this.playlistId = playlistId;
    }
}
