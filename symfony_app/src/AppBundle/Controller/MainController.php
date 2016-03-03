<?php
/**
 * Created by PhpStorm.
 * User: KMax
 * Date: 14.02.2016
 * Time: 13:57
 */
namespace AppBundle\Controller;

use AppBundle\Entity\Chat;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
Class MainController extends Controller
{
    /**
     * @Route ("/", name="_home")
     * @param Request $request
     * @return RedirectResponse | Response
     */
    public function homeAction(Request $request)
    {
        $session = $request->getSession();
        $userId = $session->get('userId');
        $login = $session->get('login');

        if ($session->get('isLogged') && $userId) {
            $em = $this->getDoctrine()
                ->getRepository('AppBundle:Chat');

            $lastMessages = $em->createQueryBuilder('c')
                ->select('c.fromUser, c.msgTime, c.message')
                ->orderBy('c.id', 'DESC')
                ->setMaxResults(20)
                ->getQuery()
                ->getResult();

            krsort($lastMessages);

            return $this->render('chat.twig',
                [
                    'pageName' => 'Home Page',
                    'userName' => $login,
                    'messages' => $lastMessages
                ]
            );
        } else {
            return $this->redirectToRoute('_login');
        }
    }

    /**
     * @Route ("/save_msg", name="_saveMsg")
     * @param Request $request
     * @return Response
     */
    public function saveMsgAction(Request $request)
    {
        $postData = $request->request->all();

        $saveMsg = new Chat();
        $saveMsg->setFromUser($postData['name']);
        $saveMsg->setMsgTime(new \DateTime($postData['time']));
        $saveMsg->setMessage($postData['message']);

        $em = $this->getDoctrine()->getManager();
        $em->persist($saveMsg);
        $em->flush();

        return new Response('Message saved');
    }
}