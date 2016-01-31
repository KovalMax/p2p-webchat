<?php
/**
 * Created by PhpStorm.
 * User: KMax
 * Date: 29.01.2016
 * Time: 23:45
 */
namespace AppBundle\Entity;

class Auth
{
    protected $login;
    protected $password;

    public function getLogin()
    {
        return $this->login;
    }

    public function setLogin($login)
    {
        $this->login = $login;
    }

    public function getPassword()
    {
        return $this->password;
    }

    public function setPassword($password)
    {
        $this->password = $password;
    }
}
