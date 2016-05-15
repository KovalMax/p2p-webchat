<?php
/**
 * Created by PhpStorm.
 * User: KMax
 * Date: 15.05.2016
 * Time: 2:15
 */

namespace AppBundle\Service;

use Doctrine\ORM\EntityManager;

class User
{
    /** @var  $em EntityManager */
    protected $_em;

    public function __construct(EntityManager $em)
    {
        $this->_em = $em;
    }

    /**
     * @param $userId
     * @return bool
     */
    public function checkIsUserExists($userId)
    {
        $user = $this->_em
            ->getRepository('AppBundle:Auth')
            ->find($userId);

        if ($user->getId() != $userId) {
            return false;
        } else {
            return true;
        }
    }
}