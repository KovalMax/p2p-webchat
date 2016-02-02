<?php
/**
 * Created by PhpStorm.
 * User: KMax
 * Date: 29.01.2016
 * Time: 23:45
 */
namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Class Auth
 * @package AppBundle\Entity
 * @ORM\Entity
 * @ORM\Table(name="users")
 *
 */
class Auth
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=255, name="userName")
     */
    protected $userName;

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $password;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set userName
     *
     * @param string $userName
     * @return Auth
     */
    public function setUserName($userName)
    {
        $this->userName = $userName;

        return $this;
    }

    /**
     * Get userName
     *
     * @return string 
     */
    public function getUserName()
    {
        return $this->userName;
    }

    /**
     * Set password
     *
     * @param string $password
     * @return Auth
     */
    public function setPassword($password)
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Get password
     *
     * @return string 
     */
    public function getPassword()
    {
        return $this->password;
    }
}
