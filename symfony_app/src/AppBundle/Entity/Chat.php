<?php
/**
 * Created by PhpStorm.
 * User: KMax
 * Date: 28.02.2016
 * Time: 21:30
 */

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
/**
 * Class Auth
 * @package AppBundle\Entity
 * @ORM\Entity
 * @ORM\Table(name="chatHistory")
 */
class Chat
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }
    /**
     * @ORM\Column(type="string", length=30, name="fromUser")
     */
    protected $fromUser;

    /**
     * @return mixed
     */
    public function getFromUser()
    {
        return $this->fromUser;
    }

    /**
     * @param mixed $fromUser
     */
    public function setFromUser($fromUser)
    {
        $this->fromUser = $fromUser;
    }

    /**
     * @ORM\Column(type="datetime", name="msgTime")
     */
    protected $msgTime;

    /**
     * @return mixed
     */
    public function getMsgTime()
    {
        return $this->msgTime;
    }

    /**
     * @param mixed $msgTime
     */
    public function setMsgTime($msgTime)
    {
        $this->msgTime = $msgTime;
    }

    /**
     * @ORM\Column(type="text")
     */
    protected $message;

    /**
     * @return mixed
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * @param mixed $message
     */
    public function setMessage($message)
    {
        $this->message = $message;
    }
    /**
     * @ORM\Column(type="string")
     */
    protected $color;

    /**
     * @return mixed
     */
    public function getColor()
    {
        return $this->color;
    }

    /**
     * @param mixed $color
     */
    public function setColor($color)
    {
        $this->color = $color;
    }
}