<?php

namespace App;

class Enc
{
 
    public function __construct()
    {
    }
    
    public static function create()
    {
        $obj = new static();
        return $obj;
    }
    
    public function getKey()
    {
        return "DC902EB35B4A57CDC2F9D9C50A57EC0F";
    }

    public function encrypt($str)
    {
        $method = "AES-256-CBC";
        $key = hash('sha256', $this->getKey(), true);
        $iv = openssl_random_pseudo_bytes(16);

        $ciphertext = openssl_encrypt($str, $method, $key, OPENSSL_RAW_DATA, $iv);
        $hash = hash_hmac('sha256', $ciphertext, $key, true);

        return base64_encode($iv . $hash . $ciphertext);
    }
    
    public function decrypt($encStr)
    {
        $ivHashCiphertext = base64_decode($encStr);
        $method = "AES-256-CBC";
        $iv = substr($ivHashCiphertext, 0, 16);
        $hash = substr($ivHashCiphertext, 16, 32);
        $ciphertext = substr($ivHashCiphertext, 48);
        $key = hash('sha256', $this->getKey(), true);

        if (hash_hmac('sha256', $ciphertext, $key, true) !== $hash) return null;

        return openssl_decrypt($ciphertext, $method, $key, OPENSSL_RAW_DATA, $iv);
    }   
}
?>